import { AppError } from "../utils/app.error.js";
import { asyncHandler } from "../utils/async.handler.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { UserRepository } from "@/repositories/user.repository.js";
export const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401);
        throw new AppError("Unauthorized: No token provided", 401);
    }
    const accessToken = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(accessToken);
    const user = await UserRepository.findById(decoded.id);
    if (!user)
        throw new AppError("Unauthorized: User not found", 401);
    req.user = user;
    next();
});
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            throw new AppError("Forbidden: You do not have permission to perform this action", 403);
        }
        next();
    };
};
export const requireEmailVerified = (req, res, next) => {
    if (!req.user) {
        res.status(401);
        throw new AppError("Unauthorized: No user information found", 401);
    }
    if (!req.user.isEmailVerified) {
        res.status(403);
        throw new AppError("Forbidden: Email not verified", 403);
    }
    next();
};
