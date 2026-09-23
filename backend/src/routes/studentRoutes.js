import { Router } from "express";
import { authenticateToken, requireRole } from "../middlewares/authMiddleware.js";
import { studentController } from "../controllers/studentController.js";

const router = Router();
router.use(authenticateToken, requireRole("STUDENT"));
router.get("/dashboard", studentController.dashboard);
router.get("/bookmarks", studentController.bookmarks);
router.post("/bookmarks/:materialId", studentController.addBookmark);
router.delete("/bookmarks/:materialId", studentController.removeBookmark);
router.post("/history/:materialId", studentController.recordAccess);
export default router;

