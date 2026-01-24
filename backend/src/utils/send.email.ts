import { sendEmail } from "./email.js";
import { generateOTP } from "./generate.otp.js";
import crypto from "crypto"
import type { IUser } from "./types.js";

export const sendEmailVerifyOTP = async (user:IUser) => {
      const otp = generateOTP();
      const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex")
      user.verifyOTP = hashedOTP
      user.verifyOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
      user.verifyOTPGeneratedAt = Date.now();
      await user.save({ validateBeforeSave: false });
    
      // Send OTP via email
      try {
        await sendEmail(
          user.email,
          "Email Verification OTP",
          `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`
        );
      } catch {
        user.verifyOTP = undefined;
        user.verifyOTPExpiry = undefined;
        user.verifyOTPGeneratedAt = undefined;
        await user.save({ validateBeforeSave: false });
      }
}

export const sendPasswordResetOTP = async (user: IUser) => {
  const resetPasswordOTP = generateOTP();
  const hashedOTP = crypto.createHash("sha256").update(resetPasswordOTP).digest("hex")
  user.resetPasswordOTP = hashedOTP;
  user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
  user.resetPasswordOTPGeneratedAt = Date.now();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP for password reset is: ${resetPasswordOTP}. It is valid for 10 minutes.`
    );
  } catch {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.resetPasswordOTPGeneratedAt = undefined;
    await user.save({ validateBeforeSave: false });
  }
};