import { generateContent } from "../services/geminiService.js";

/**
 * @file docuController.js
 * @description Handles document-related requests such as upload and analysis.
 */

/**
 * Upload a legal document for processing (Placeholder Implementation)
 * @route POST /api/documents/upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export function uploadDocument(_req, res) {
    return res.status(501).json({ message: "Not Implemented: uploadDocument" });
}

/**
 * Analyze a legal document using Gemini AI
 * @route POST /api/documents/analyze
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function analyzeDocument(req, res) {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "No document content provided." });
        }

        const prompt = `Analyze the following legal document and categorize it into:
        - Common and typical information
        - Important information requiring attention
        - Fields that need to be filled out

        Document:
        """
        ${content}
        """`;
        
        const response = await generateContent(prompt);
        res.json({ analysis: response });

    } catch (error) {
        console.error("Error analyzing document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}