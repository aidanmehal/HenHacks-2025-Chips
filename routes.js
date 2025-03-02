const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");

/**
 * @route POST /api/documents/upload
 * @description Uploads a legal document for processing
 * @access Public
 */
router.post("/upload", documentController.uploadDocument);

/**
 * @route POST /api/documents/analyze
 * @description Analyzes an uploaded legal document and categorizes its contents
 * @access Public
 */
router.post("/analyze", documentController.analyzeDocument);

module.exports = router;
