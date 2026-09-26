import { Router } from "express";
import multer from "multer";
import { materialController } from "../controllers/materialController.js";
import { authenticateToken, requireRole, optionalAuth } from "../middlewares/authMiddleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "image/png", "image/jpeg", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|doc|docx|ppt|pptx|png|jpg|jpeg)$/i)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only PDF, Word, PowerPoint, and image files are allowed."));
  },
});

const router = Router();

router.get("/recent", optionalAuth, materialController.getRecentMaterials);
router.get("/categories", materialController.getCategories);
router.get("/", optionalAuth, materialController.getMaterials);
router.get("/:id", optionalAuth, materialController.getMaterialById);
router.post("/upload", authenticateToken, requireRole("ADMIN"), upload.single("file"), materialController.uploadMaterial);
router.post("/", authenticateToken, requireRole("ADMIN"), materialController.createMaterial);
router.put("/:id", authenticateToken, requireRole("ADMIN"), materialController.updateMaterial);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), materialController.deleteMaterial);
router.post("/:id/view", materialController.incrementView);
router.post("/:id/download", materialController.incrementDownload);

export default router;
