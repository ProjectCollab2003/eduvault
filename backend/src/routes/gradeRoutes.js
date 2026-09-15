import { Router } from "express";
import { gradeController } from "../controllers/gradeController.js";
import { authenticateToken, requireRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", gradeController.getGrades);
router.get("/:id", gradeController.getGradeById);
router.post("/", authenticateToken, requireRole("ADMIN"), gradeController.createGrade);
router.put("/:id", authenticateToken, requireRole("ADMIN"), gradeController.updateGrade);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), gradeController.deleteGrade);

export default router;
