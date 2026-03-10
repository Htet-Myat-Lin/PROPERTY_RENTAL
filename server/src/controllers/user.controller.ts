import type { Response } from "express";
import type { AuthRequest } from "../utils/types.js";
import { AppError } from "../utils/app.error.js";

export const getUser = (req: AuthRequest, res: Response) => {
    if (!req.user) {
        throw new AppError("User not found in request", 404);
    }
    res.status(200).json({
        success: true,
        user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            isEmailVerified: req.user.isEmailVerified,
            profilePictures: req.user.profilePictures,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt
        }
    });
}