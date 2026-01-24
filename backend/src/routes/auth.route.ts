import { Router } from "express"
import { forgotPassword, login, logout, refreshAccessToken, register, resetPassword, sendResetPasswordOTP, sendVerifyEmailOTP, verifyEmail } from "../controllers/auth.controller.js"

const router = Router()
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/send-verify-email-otp", sendVerifyEmailOTP)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/send-reset-password-otp", sendResetPasswordOTP)
router.post("/reset-password", resetPassword)
router.get("/refresh-access-token", refreshAccessToken)

export default router