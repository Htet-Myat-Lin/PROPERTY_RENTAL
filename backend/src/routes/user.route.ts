import { Router } from "express";
import { getUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", protect, getUser)

export default router;