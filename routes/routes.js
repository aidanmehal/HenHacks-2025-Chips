import express from "express";
import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { uploadDocument, analyzeDocument } from "../controllers/docuController.js";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();
const uploadDir = "uploads/";

// Ensure 'uploads/' directory exists asynchronously
fs.promises.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("❌ Invalid file type. Only PDF and Word documents are allowed."), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
});

// Ensure frontend receives JSON response after file upload
router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const uploadResult = await uploadDocument(req, res);
        res.json(uploadResult);
    } catch (error) {
        res.status(500).json({ error: "Upload failed", details: error.message });
    }
});

// Ensure frontend can analyze documents properly
router.post("/analyze", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file provided for analysis" });
    }

    try {
        const analysisResult = await analyzeDocument(req, res);
        res.json(analysisResult);
    } catch (error) {
        res.status(500).json({ error: "Analysis failed", details: error.message });
    }
});

// User registration endpoint
router.post("/register", registerUser);

export default router;