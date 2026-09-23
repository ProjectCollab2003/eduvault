import { Router } from "express";
import { announcementController } from "../controllers/announcementController.js";
import { authenticateToken, requireRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", announcementController.getAnnouncements);
router.get("/:id", announcementController.getAnnouncementById);
router.post("/", authenticateToken, requireRole("ADMIN"), announcementController.createAnnouncement);
router.put("/:id", authenticateToken, requireRole("ADMIN"), announcementController.updateAnnouncement);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), announcementController.deleteAnnouncement);

export default router;
