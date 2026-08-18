import { generateOTP } from "./generate.otp.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { emailQueue } from "@/queues/email.queue.js";
import crypto from "crypto";
export const sendEmailVerifyOTP = async (user) => {
    const otp = generateOTP();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    const nowSec = Math.floor(Date.now() / 1000);
    await UserRepository.saveVerifyOTP(user.id, hashedOTP, nowSec + 10 * 60, nowSec);
    await emailQueue.add("verifyEmail", // job name
    {
        to: user.email,
        subject: "Email Verification OTP",
        text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`,
    }, {
        attempts: 3, // retry up to 3 times on failure
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: false, // keep failed jobs for inspection
    });
};
export const sendPasswordResetOTP = async (user) => {
    const resetPasswordOTP = generateOTP();
    const hashedOTP = crypto
        .createHash("sha256")
        .update(resetPasswordOTP)
        .digest("hex");
    const nowSec = Math.floor(Date.now() / 1000);
    await UserRepository.saveResetPasswordOTP(user.id, hashedOTP, nowSec + 10 * 60, nowSec);
    // Add to queue instead of calling sendEmail() directly
    await emailQueue.add("passwordReset", {
        to: user.email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${resetPasswordOTP}. It is valid for 10 minutes.`,
    }, {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: false,
    });
};
