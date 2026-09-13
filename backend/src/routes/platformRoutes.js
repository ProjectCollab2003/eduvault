import { Router } from "express";
import { platformController } from "../controllers/platformController.js";

const router = Router();

router.get("/", platformController.getStats);

export default router;
