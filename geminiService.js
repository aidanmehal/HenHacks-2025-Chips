import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API client with the API key from the .env file
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
        return result.response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        throw new Error("Failed to generate content");
    }
}

