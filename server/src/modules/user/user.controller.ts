import { successResponse } from "@/utils/api.response";
import { NotFoundError } from "@/utils/app.error";
import { asyncHandler } from "@/utils/async.handler";

export const getMe = asyncHandler(async (req, res, _next) => {
    if (!req.user) throw new NotFoundError("User");
    const user = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
        profilePicture: req.user.profilePicture,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
    }
    successResponse(res, "User was fetched", 200, {  user });
});