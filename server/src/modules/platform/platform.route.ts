import { protect, restrictTo } from "@/middleware/auth.middleware";
import { Router } from "express";
import { getPlatformSummary } from "./platform.controller";

const router = Router();

router.use(protect);

router.get('/summary', restrictTo("ADMIN"), getPlatformSummary);

export { router as platformRouter };
