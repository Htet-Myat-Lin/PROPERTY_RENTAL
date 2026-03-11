import { sendEmail } from "./email.js";
import { generateOTP } from "./generate.otp.js";
import crypto from "crypto";
import { UserRepository } from "@/repositories/user.repository.js";

export const sendEmailVerifyOTP = async (user: any) => {
  const otp = generateOTP();
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  // store timestamps in seconds to fit within 32-bit integer range
  const nowSec = Math.floor(Date.now() / 1000);
  await UserRepository.saveVerifyOTP(
    user.id,
    hashedOTP,
    nowSec + 10 * 60, // expires in 10 minutes
    nowSec,
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
  const nowSec = Math.floor(Date.now() / 1000);
  await UserRepository.saveResetPasswordOTP(
    user.id,
    hashedOTP,
    nowSec + 10 * 60,
    nowSec,
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
