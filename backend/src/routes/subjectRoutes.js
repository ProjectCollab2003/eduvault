import { Router } from "express";
import { subjectController } from "../controllers/subjectController.js";
import { authenticateToken, requireRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", subjectController.getSubjects);
router.get("/:id", subjectController.getSubjectById);
router.post("/", authenticateToken, requireRole("ADMIN"), subjectController.createSubject);
router.put("/:id", authenticateToken, requireRole("ADMIN"), subjectController.updateSubject);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), subjectController.deleteSubject);

export default router;
