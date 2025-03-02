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

import documentRoutes from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
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