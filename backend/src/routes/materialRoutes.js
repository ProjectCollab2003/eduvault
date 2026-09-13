import { Router } from "express";
import { materialController } from "../controllers/materialController.js";

const router = Router();

router.get("/recent", materialController.getRecentMaterials);
router.get("/", materialController.getMaterials);
router.get("/:id", materialController.getMaterialById);
router.post("/:id/view", materialController.incrementView);
router.post("/:id/download", materialController.incrementDownload);

export default router;
