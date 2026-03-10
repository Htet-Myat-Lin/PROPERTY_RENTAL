import { sendEmail } from "./email.js";
import { generateOTP } from "./generate.otp.js";
import crypto from "crypto";
import { UserRepository } from "@/repositories/user.repository.js";

export const sendEmailVerifyOTP = async (user: any) => {
  const otp = generateOTP();
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  await UserRepository.saveVerifyOTP(
    user.id,
    hashedOTP,
    Date.now() + 10 * 60 * 1000,
    Date.now(),
  );

  // Send OTP via email
  try {
    await sendEmail(
      user.email,
      "Email Verification OTP",
      `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`,
    );
  } catch {
    await UserRepository.clearVerifyOTP(user.id);
  }
};

export const sendPasswordResetOTP = async (user: any) => {
  const resetPasswordOTP = generateOTP();
  const hashedOTP = crypto
    .createHash("sha256")
    .update(resetPasswordOTP)
    .digest("hex");
  await UserRepository.saveResetPasswordOTP(
    user.id,
    hashedOTP,
    Date.now() + 10 * 60 * 1000,
    Date.now(),
  );

  try {
    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${resetPasswordOTP}. It is valid for 10 minutes.`,
    );
  } catch {
    await UserRepository.clearResetPasswordOTP(user.id);
  }
};
