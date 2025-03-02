import "dotenv/config"; // This loads .env variables correctly
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import documentRoutes from "./routes/routes.js"; // Ensure this file exists

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(morgan("dev"));

// Routes
app.use("/api/documents", documentRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
    console.error("Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// Export the Express app for testing
export default app;

