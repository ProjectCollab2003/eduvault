import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);
router.get("/me", authenticateToken, authController.getMe);

export default router;
