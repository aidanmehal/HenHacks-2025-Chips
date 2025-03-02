import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { generateContent } from "../services/geminiService.js";

/**
 * Upload a legal document for processing
 */
const uploadDocument = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
        message: "File uploaded successfully",
        filePath: req.file.path
    });
};

/**
 * Delete a file after processing
 */
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error("⚠️ Error deleting file:", err);
    });
};

/**
 * Parse AI response safely
 */
const safeParseJSON = (response) => {
    try {
        let text = typeof response === "object" && response.parts ? response.parts[0]?.text : response;
        text = text.replace(/^```json\s*|```$/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("⚠️ Failed to parse JSON:", error, "Response:", response);
        return null;
    }
};

/**
 * Analyze a document using Gemini AI
 */
const analyzeDocument = async (req, res) => {
    try {
        let documentText = "";

        if (req.file) {
            const filePath = req.file.path;
            const fileExt = path.extname(filePath).toLowerCase();

            if (fileExt === ".pdf") {
                const dataBuffer = fs.readFileSync(filePath);
                const pdfData = await pdfParse(dataBuffer);
                documentText = pdfData.text;
            } else if (fileExt === ".docx") {
                const dataBuffer = fs.readFileSync(filePath);
                const result = await mammoth.extractRawText({ buffer: dataBuffer });
                documentText = result.value;
            } else {
                return res.status(400).json({ error: "Unsupported file format" });
            }

            deleteFile(filePath);
        } else if (req.body.content) {
            documentText = req.body.content;
        } else {
            return res.status(400).json({ error: "No document content provided" });
        }

        // Prepare the prompt for Gemini AI
        const prompt = `You are an AI Legal Document Assistant. Your goal is to make complex legal documents readable without skipping important information. You do NOT summarize, but instead categorize sections for better understanding.

Analyze the document **section by section** and classify each as:
1️⃣ **Basic:** Common legal terms that do not significantly impact the reader.
2️⃣ **Important:** Sections with unusual, high-impact, or potentially risky terms.
3️⃣ **Fillable Fields:** Any sections requiring a signature, date, or initials.

For each classification:
- Generate a **title (≤ 10 words)** summarizing the section.
- Provide the **full section content** mapped to its title.

📌 **Return JSON ONLY in this exact format (no extra text, no explanations):**
{
  "basic": { "Title 1": "Full content of basic section", ... },
  "important": { "Title 2": "Full content of important section", ... },
  "fill": { "Field requirement sentence": "Title of relevant section" }
}`;

        const ratingPrompt = `Rate the legal document based on how typical and safe it is. Provide a score from **1 to 10** where:
- **10** = Standard, safe document
- **1** = Unusual, risky agreement

📌 **Return JSON ONLY in this exact format (no extra text, no explanations):**
{
  "rating": X, // Integer from 1-10
  "reason": "Brief explanation of the rating"
}`;

        const response = await generateContent(prompt);
        const ratingResponse = await generateContent(ratingPrompt);

        console.log("📥 AI Raw Response:", response);
        console.log("📥 AI Raw Rating Response:", ratingResponse);

        // Parse AI response properly
        const parsedResponse = safeParseJSON(response);
        const parsedRatingResponse = safeParseJSON(ratingResponse);

        if (!parsedResponse || !parsedRatingResponse) {
            return res.status(500).json({
                error: "AI response is invalid. Please try again.",
                debug: {
                    aiAnalysis: response,
                    aiRating: ratingResponse
                }
            });
        }

        res.json({
            message: "Analysis complete",
            analysis: parsedResponse,
            rating: parsedRatingResponse
        });
    } catch (error) {
        console.error("❌ Error analyzing document:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// ✅ Correctly export both functions ONCE
export { uploadDocument, analyzeDocument };


