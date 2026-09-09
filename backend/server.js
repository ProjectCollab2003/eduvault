import express from "express";
import pool from "./src/config/db.js";

const app = express();

app.use(express.json());

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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});