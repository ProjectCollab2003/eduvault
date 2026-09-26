import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import platformRoutes from "./src/routes/platformRoutes.js";
import gradeRoutes from "./src/routes/gradeRoutes.js";
import subjectRoutes from "./src/routes/subjectRoutes.js";
import materialRoutes from "./src/routes/materialRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import announcementRoutes from "./src/routes/announcementRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";

// Middlewares
import { errorHandler } from "./src/middlewares/errorHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Global Middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

// Health / Test Route
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "eduvault-backend" });
});

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
app.use("/api/subjects", subjectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/student", studentRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`EduVault Backend running on http://localhost:${PORT}`);
  });
}

export default app;
