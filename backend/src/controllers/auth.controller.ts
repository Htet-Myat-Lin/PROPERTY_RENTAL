import { UserService } from "../services/user.service.js";
import { AppError } from "../utils/app.error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { sendEmailVerifyOTP, sendPasswordResetOTP } from "../utils/send.email.js";
import crypto from "crypto"

const register = asyncHandler(async (req, res, next) => {
  const newUser = await UserService.createUser(req.body);

  const refreshToken = generateRefreshToken(newUser._id.toString());
  const accessToken = generateAccessToken(newUser._id.toString());
  newUser.refreshToken = refreshToken;
  await newUser.save({ validateBeforeSave: false });

  sendEmailVerifyOTP(newUser)

  res.cookie("token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  res.status(201).json({
    success: true,
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isEmailVerified: newUser.isEmailVerified,
      role: newUser.role,
      profilePictures: newUser.profilePictures,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    },
    accessToken,
    message: "User registered successfully",
  });
});

const login = asyncHandler(async (req, res, next) => {
  const user = await UserService.getUserByEmail(req.body.email);
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password", 400);
  }

  const refreshToken = generateRefreshToken(user._id.toString());
  const accessToken = generateAccessToken(user._id.toString());
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
      profilePictures: user.profilePictures,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    accessToken
  });
});

const logout = asyncHandler(async(req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
})

const sendVerifyEmailOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserService.getUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isEmailVerified) {
    throw new AppError("Email is already verified", 400);
  }

  if (user.verifyOTPGeneratedAt && Date.now() - user.verifyOTPGeneratedAt < 60 * 1000) {
    throw new AppError("OTP already sent. Please wait before requesting a new one.", 429);
  }

  sendEmailVerifyOTP(user).catch((err) => {
    if(err) throw new AppError("Failed to send OTP to your email", 400)
  })

  res.status(200).json({
    success: true,
    message: "OTP sent to email successfully",
  });
});

const verifyEmail = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex")
    const user = await UserService.getUserByEmail(email);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user.isEmailVerified) {
        throw new AppError("Email is already verified", 400);
    }
    if (user?.verifyOTP !==  hashedOTP || !user.verifyOTPExpiry || Date.now() > user.verifyOTPExpiry) {
        throw new AppError("Invalid or expired OTP", 400);
    }
    user.isEmailVerified = true;
    user.verifyOTP = undefined;
    user.verifyOTPExpiry = undefined;
    user.verifyOTPGeneratedAt = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Email verified successfully",
    });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    console.log(email)
    const user = await UserService.getUserByEmail(email);
    if (!user) {
        throw new AppError("User with this email was not found", 404);
    }

    sendPasswordResetOTP(user).catch(() => {throw new AppError("Fail to send OTP to your email.", 400)})

    res.status(200).json({
        success: true,
        message: "Reset Password OTP sent successfully"
    }); 
})

const sendResetPasswordOTP = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await UserService.getUserByEmail(email);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.resetPasswordOTPGeneratedAt && Date.now() - user.resetPasswordOTPGeneratedAt < 60 * 1000) {
        throw new AppError("OTP already sent. Please wait before requesting a new one.", 429);
    }
    
    sendPasswordResetOTP(user)

    res.status(200).json({
        success: true,
        message: "OTP sent to email successfully",
    });
})

const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, newPassword, confirmNewPassword } = req.body;
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex")
    const user = await UserService.getUserByEmail(email);

    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (user.resetPasswordOTP !== hashedOTP || !user.resetPasswordOTPExpiry || Date.now() > user.resetPasswordOTPExpiry) {
        throw new AppError("Invalid or expired OTP", 400);
    }

    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.resetPasswordOTPGeneratedAt = undefined;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
})

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.token;
    if (!refreshToken) {
        throw new AppError("No refresh token provided", 401);
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await UserService.getUserById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
        throw new AppError("Invalid refresh token", 401);
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken: newAccessToken,
    });
})

export { register, login, logout, sendVerifyEmailOTP, verifyEmail, forgotPassword, sendResetPasswordOTP, resetPassword, refreshAccessToken };
