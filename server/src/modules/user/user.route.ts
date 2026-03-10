import { protect } from "@/middleware/auth.middleware";
import { Router } from "express";
import { getMe } from "./user.controller";

const router = Router();

router.get("/me", protect, getMe)

export { router as userRouter }