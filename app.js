import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import documentRoutes from "./routes/routes.js"; // Ensure this file exists

const app = express();
const PORT = process.env.PORT || 3000;

// Allow frontend to communicate with backend
app.use(cors({ origin: "http://localhost:5500", credentials: true }));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(morgan("dev"));

// Serve frontend files (if hosting together)
app.use(express.static(path.join(process.cwd(), "public")));

// Routes
app.use("/api/documents", documentRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
    console.error("Error:", err?.stack || err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// Export for testing
export default app;

