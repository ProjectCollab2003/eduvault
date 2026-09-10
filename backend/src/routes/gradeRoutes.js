import { Router } from "express";
import { gradeController } from "../controllers/gradeController.js";

const router = Router();

router.get("/", gradeController.getGrades);
router.get("/:id", gradeController.getGradeById);

export default router;
