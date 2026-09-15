import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { authenticateToken, requireRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/students", authenticateToken, requireRole("ADMIN"), userController.getStudents);
router.get("/students/:id", authenticateToken, requireRole("ADMIN"), userController.getStudentById);

export default router;
