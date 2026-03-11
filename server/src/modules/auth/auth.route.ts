import { validate } from "@/middleware/validation.middleware";
import { Router } from "express";
import { loginSchema, registerSchema, resetPasswordSchema } from "./auth.validation";
import { forgotPassword, login, logout, refreshAccessToken, register, resetPassword, sendEmailVerifyOTP, sendResetPasswordOTP, verifyEmail } from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/logout", logout)
router.post("/send-verify-email-otp", sendEmailVerifyOTP)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/send-reset-password-otp", sendResetPasswordOTP)
router.post("/reset-password", validate(resetPasswordSchema), resetPassword)
router.get("/refresh-access-token", refreshAccessToken)

export { router as authRouter };