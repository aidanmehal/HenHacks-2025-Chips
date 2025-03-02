import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { generateContent } from "../services/geminiService.js";

let lastAnalysisResult = null; // In-memory store for the last analysis result

const uploadDir = "uploads/";

const uploadDocument = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(`✅ File uploaded: ${req.file.filename}`);

    res.json({
        message: "File uploaded successfully",
        filePath: req.file.path
    });
};

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error("⚠️ Error deleting file:", err);
    });
};

const clearUploadsDirectory = () => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error("⚠️ Error reading uploads directory:", err);
            return;
        }
        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), err => {
                if (err) console.error("⚠️ Error deleting file:", err);
            });
        }
    });
};

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

const analyzeDocument = async (req, res) => {
    let filePath = null;
    try {
        console.log("🔍 Analyzing document...");
        let documentText = "";

        if (req.file) {
            filePath = req.file.path; // Get the file path from the uploads directory
            console.log(`📄 File path: ${filePath}`);
            const fileExt = path.extname(filePath).toLowerCase();

            if (fileExt === ".pdf") {
                const dataBuffer = fs.readFileSync(filePath);
                const pdfData = await pdfParse(dataBuffer);
                documentText = pdfData.text;
                console.log("📄 PDF document text extracted");
            } else if (fileExt === ".docx") {
                const dataBuffer = fs.readFileSync(filePath);
                const result = await mammoth.extractRawText({ buffer: dataBuffer });
                documentText = result.value;
                console.log("📄 DOCX document text extracted");
            } else {
                console.error("❌ Unsupported file format");
                return res.status(400).json({ error: "Unsupported file format" });
            }
        } else if (req.body.content) {
            documentText = req.body.content;
            console.log("📄 Document content from request body");
        } else {
            console.error("❌ No document content provided");
            return res.status(400).json({ error: "No document content provided" });
        }

        console.log("📄 Document text to be analyzed:", documentText);

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
}

Document Text:
${documentText}`;

        const ratingPrompt = `Rate the legal document based on how typical and safe it is. Provide a score from **1 to 10** where:
- **10** = Standard, safe document
- **1** = Unusual, risky agreement

📌 **Return JSON ONLY in this exact format (no extra text, no explanations):**
{
  "rating": X, // Integer from 1-10
  "reason": "Brief explanation of the rating"
}

Document Text:
${documentText}`;

        console.log("📝 Sending prompts to AI service...");
        const response = await generateContent(prompt);
        const ratingResponse = await generateContent(ratingPrompt);

        console.log("📥 AI Raw Response:", response);
        console.log("📥 AI Raw Rating Response:", ratingResponse);

        const parsedResponse = safeParseJSON(response);
        const parsedRatingResponse = safeParseJSON(ratingResponse);

        if (!parsedResponse || !parsedRatingResponse) {
            console.error("❌ AI response is invalid");
            return res.status(500).json({
                error: "AI response is invalid. Please try again.",
                debug: {
                    aiAnalysis: response,
                    aiRating: ratingResponse
                }
            });
        }

        lastAnalysisResult = {
            message: "Analysis complete",
            analysis: parsedResponse,
            rating: parsedRatingResponse
        };

        console.log("✅ Analysis complete");
        res.json(lastAnalysisResult); // final output !!!
    } catch (error) {
        console.error("❌ Error analyzing document:", error);
        res.status(500).json({ error: "Internal Server Error." });
    } finally {
        console.log("🧹 Cleaning up...");
        // Ensure the file is deleted after processing
        if (filePath) {
            deleteFile(filePath);
        }
        // Clear the uploads directory
        clearUploadsDirectory();
    }
};

const getLastAnalysisResult = (req, res) => {
    console.log("🔍 Retrieving last analysis result...");
    if (!lastAnalysisResult) {
        return res.status(404).json({ error: "No analysis result available" });
    }
    res.json(lastAnalysisResult);
};

export { uploadDocument, analyzeDocument, getLastAnalysisResult };