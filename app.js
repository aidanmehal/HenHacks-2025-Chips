/**
 * @file app.js
 * @description Main application file for the HenHacks-2025-Chips project.
 * @requires dotenv
 * @requires express
 * @requires cors
 * @requires ./routes/document
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");     
const documentRoutes = require("./routes/document");
const app = express();

/**
 * Middleware to enable Cross-Origin Resource Sharing (CORS)and to parse incoming JSON requests.
 */
app.use(cors());
app.use(express.json());

/**
 * Route for handling document-related API requests.
 * @name /api/documents
 * @function
 * @memberof module:app
 * @inner
 */
app.use("/api/documents", documentRoutes);
module.exports = app;