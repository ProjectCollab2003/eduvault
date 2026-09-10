import { Router } from "express";
import { announcementController } from "../controllers/announcementController.js";

const router = Router();

router.get("/", announcementController.getAnnouncements);
router.get("/:id", announcementController.getAnnouncementById);

export default router;
