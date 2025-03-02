import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";


// Import the Sequelize instance and models here
import sequelize from "./config/database.js";
import User from "./models/User.js";
import Document from "./models/Document.js";
import DocumentFeedback from "./models/DocumentFeedback.js";
import userRoutes from "./routes/routes.js";
import documentRoutes from "./routes/routes.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(process.cwd(), 'Frontend')));

app.use("/", userRoutes);

// Allow frontend to communicate with backend
app.use(cors({ origin: "http://localhost:5500", credentials: true }));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(morgan("dev"));

// Sync the models to actually create the tables
sequelize.sync({ force: false })
  .then(() => {
    console.log("✅ Tables synced successfully.");
  })
  .catch((err) => {
    console.error("❌ Error syncing models:", err);
  });

// Serve frontend files (if hosting together)
app.use(express.static(path.join(process.cwd(), "public")));

// Routes
app.use("/api/documents", documentRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
    console.error("Error:", err?.stack || err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

app.use("/api/users", userRoutes);

// Export the Express app for testing
export default app;


