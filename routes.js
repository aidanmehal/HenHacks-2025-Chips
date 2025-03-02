import express from "express";
import { uploadDocument, analyzeDocument } from "./docuController.js"; // Match the actual file name

const router = express.Router();

/**
 * @route POST /api/documents/upload
 * @description Uploads a legal document for processing
 * @access Public
 */
router.post("/upload", uploadDocument);

/**
 * @route POST /api/documents/analyze
 * @description Analyzes an uploaded legal document and categorizes its contents
 * @access Public
 */
router.post("/analyze", analyzeDocument);

export default router; // Use ES Module export
