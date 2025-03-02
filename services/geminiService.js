import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure API key is set
if (!process.env.GEMINI_API_KEY) {
    throw new Error("❌ Missing GEMINI_API_KEY in environment variables.");
}

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Generates content based on an input prompt using Gemini AI.
 * @param {string} prompt - The text prompt for Gemini AI
 * @returns {Promise<string>} - AI-generated response
 */
export async function generateContent(prompt) {
    try {
        const result = await model.generateContent(prompt);

        if (!result || !result.response) {
            throw new Error("❌ Invalid response from Gemini AI.");
        }

        const textResponse = result.response?.candidates?.[0]?.content || result.response?.text || "No response";

        return textResponse;
    } catch (error) {
        console.error("Gemini AI Error:", error?.response?.data || error.message || error);
        throw new Error("Failed to generate content. Please try again.");
    }
}


