import bcrypt from "bcrypt";
import { sendEmailVerifyOTP, sendPasswordResetOTP } from "./../../utils/send.email";
import type { LoginSchema, RegisterSchema } from "./auth.validation";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/utils/jwt";
import { AppError } from "@/utils/app.error";
import crypto from "crypto"
import { UserRepository } from "@/repositories/user.repository";

export const registerService = async (
  data: Omit<RegisterSchema, "confirmPassword">,
) => {
  // hash password
  data.password = await bcrypt.hash(data.password, 10);

  // create user
  const newUser = await UserRepository.create(data);

  // generate tokens
  const refreshToken = generateRefreshToken(newUser.id);
  const accessToken = generateAccessToken(newUser.id);

  // update user with refreshToken
  const updatedUser = await UserRepository.updateRefreshToken(newUser.id, refreshToken)

  // sending email verification otp
  await sendEmailVerifyOTP(newUser);

  return { accessToken, refreshToken, user: updatedUser };
};

export const loginService = async (data: LoginSchema) => {
  const user = await UserRepository.findByEmail(data.email);

  if (!user || !(await bcrypt.compare(data.password, user.password)))
    throw new AppError("Invalid email or password", 400);

  const refreshToken = generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user.id);

  const updatedUser = await UserRepository.updateRefreshToken(user.id, refreshToken)

  return { accessToken, refreshToken, user: updatedUser };
};

export const sendVerifyEmailOTPService = async (email: string) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new AppError("User with this email not found", 404);

  if (user.isEmailVerified)
    throw new AppError("Email is already verified", 400);

  if (
    user.verifyOTPGeneratedAt &&
    Date.now() - user.verifyOTPGeneratedAt < 60 * 1000
  ) {
    throw new AppError(
      "OTP already sent. Please wait before requesting a new one.",
      429,
    );
  }

  await sendEmailVerifyOTP(user).catch((err) => {
    if (err) throw new AppError("Failed to send OTP to your email", 400);
  });

  return { message: "OTP sent to email successfully" };
};

export const verifyEmailService = async (email: string, otp: string) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new AppError("User with this email not found", 404);

  if (user.isEmailVerified) throw new AppError("Email is already verified", 400);

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex")
  if (user?.verifyOTP !==  hashedOTP || !user.verifyOTPExpiry || Date.now() > user.verifyOTPExpiry) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  await UserRepository.verifyEmail(user.id)

  return { message: "Email verified successfully" };
}

export const forgotPasswordService = async (email: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError("User with this email not found", 404);

    if (user.resetPasswordOTPGeneratedAt && Date.now() - user.resetPasswordOTPGeneratedAt < 60 * 1000) {
        throw new AppError("OTP already sent. Please wait before requesting a new one.", 429);
    }
    
    sendPasswordResetOTP(user)

    return { message: "OTP sent to email successfully" };
}

export const sendResetPasswordOTPService = async (email: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError("User with this email not found", 404);

    if (user.resetPasswordOTPGeneratedAt && Date.now() - user.resetPasswordOTPGeneratedAt < 60 * 1000) {
        throw new AppError("OTP already sent. Please wait before requesting a new one.", 429);
    }
    
    sendPasswordResetOTP(user)

    return { message: "OTP sent to email successfully" };
}

export const resetPasswordService = async (email: string, otp: string, password: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError("User with this email not found", 404);

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex")
    if (user?.resetPasswordOTP !==  hashedOTP || !user.resetPasswordOTPExpiry || Date.now() > user.resetPasswordOTPExpiry) {
        throw new AppError("Invalid or expired OTP", 400);
    }

    await UserRepository.resetPassword(user.id, password)

    return { message: "Password reset successfully" };
}

export const refreshAccessTokenService = async (refreshToken: string) => {
    const decodedToken = verifyRefreshToken(refreshToken)

    const user = await UserRepository.findById(decodedToken.id)
    if (!user || user.refreshToken !== refreshToken) throw new AppError("User not found", 404);

    const newAccessToken = generateAccessToken(user.id)
    const newRefreshToken = generateRefreshToken(user.id)

    await UserRepository.updateRefreshToken(user.id, newRefreshToken)

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}
