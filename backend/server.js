import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import platformRoutes from "./src/routes/platformRoutes.js";
import gradeRoutes from "./src/routes/gradeRoutes.js";
import materialRoutes from "./src/routes/materialRoutes.js";
import announcementRoutes from "./src/routes/announcementRoutes.js";

// Middlewares
import { errorHandler } from "./src/middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health / Test Route
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Mount Feature API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stats", platformRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/announcements", announcementRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`EduVault Backend running on http://localhost:${PORT}`);
  });
}

export default app;