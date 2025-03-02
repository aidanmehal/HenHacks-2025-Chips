/**
 * @file app.js
 * @description Initializes and starts the Express server for the HenHacks-2025-Chips project.
 * @requires dotenv - Loads environment variables.
 * @requires express - Web framework for handling API requests.
 * @requires cors - Middleware to enable Cross-Origin Resource Sharing.
 * @requires helmet - Security middleware to set HTTP headers.
 * @requires compression - Middleware to reduce response sizes.
 * @requires morgan - Logger for request debugging.
 * @requires ./routes/document - API routes for document handling.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const documentRoutes = require("./routes/document");

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware:
 * - helmet: Secures HTTP headers.
 * - cors: Enables Cross-Origin Resource Sharing.
 * - express.json: Parses incoming JSON requests.
 * - compression: Reduces response size for better performance.
 * - morgan: Logs HTTP requests for debugging.
 */
app.use(helmet());        // Security headers should be set before CORS
app.use(cors());          // Enable CORS
app.use(express.json());  // Parse JSON requests
app.use(compression());   // Compress responses
app.use(morgan("dev"));   // Log requests

/**
 * Route for handling document-related API requests.
 * @name /api/documents
 * @function
 * @memberof module:app
 * @inner
 */
app.use("/api/documents", documentRoutes);

/**
 * Global error handler for catching unhandled errors.
 * @function
 * @memberof module:server
 * @inner
 */
app.use((err, _req, res, _next) => {
    console.error("Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

/**
 * Start the Express server.
 */
app.listen(PORT, () => {
    console.log("Server is running at http://localhost:${PORT}");
});

/**
 * Export the Express app for testing or further configuration.
 * @module app
 */
module.exports = app;
