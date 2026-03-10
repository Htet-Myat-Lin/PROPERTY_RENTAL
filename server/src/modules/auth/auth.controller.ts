import { asyncHandler } from "@/utils/async.handler";
import {
   forgotPasswordService,
  loginService,
  refreshAccessTokenService,
  registerService,
  resetPasswordService,
  sendResetPasswordOTPService,
  sendVerifyEmailOTPService,
  verifyEmailService,
} from "./auth.service";
import { cookieResponse, successResponse } from "@/utils/api.response";

export const register = asyncHandler(async (req, res, _next) => {
  const { confirmPassword, ...data } = req.body;
  const { accessToken, refreshToken, user } = await registerService(data);
  cookieResponse(res, refreshToken);
  successResponse(res, "Registration successful", 201, { accessToken, user });
});

export const login = asyncHandler(async (req, res, _next) => {
  const { accessToken, refreshToken, user } = await loginService(req.body);
  cookieResponse(res, refreshToken);
  successResponse(res, "Login successful", 200, { accessToken, user });
});

export const logout = asyncHandler(async (req, res, _next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  successResponse(res, "Logout successful", 200);
});

export const sendEmailVerifyOTP = asyncHandler(async (req, res, _next) => {
  const { message } = await sendVerifyEmailOTPService(req.body.email);
  successResponse(res, message, 200);
});

export const verifyEmail = asyncHandler(async (req, res, _next) => {
  const { message } = await verifyEmailService(req.body.email, req.body.otp);
  successResponse(res, message, 200);
});

export const forgotPassword = asyncHandler(async (req, res, _next) => {
  const { message } = await forgotPasswordService(req.body.email);
  successResponse(res, message, 200);
})

export const sendResetPasswordOTP = asyncHandler(async (req, res, _next) => {
  const { message } = await sendResetPasswordOTPService(req.body.email);
  successResponse(res, message, 200);
});

export const resetPassword = asyncHandler(async (req, res, _next) => {
  const { message } = await resetPasswordService(req.body.email, req.body.otp, req.body.newPassword);
  successResponse(res, message, 200);
});

export const refreshAccessToken = asyncHandler(async (req, res, _next) => {
  const { token } = req.cookies
  const { accessToken, refreshToken } = await refreshAccessTokenService(token)
  cookieResponse(res, refreshToken)
  successResponse(res, "Access token refreshed successfully", 200, { accessToken });
});