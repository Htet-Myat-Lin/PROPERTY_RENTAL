import { successResponse } from "@/utils/api.response";
import { AppError, NotFoundError } from "@/utils/app.error";
import { asyncHandler } from "@/utils/async.handler";
import { changePasswordService, removeProfilePictureService, updateProfilePictureService, updateProfileService } from "./user.service";

export const getMe = asyncHandler(async (req, res, _next) => {
    if (!req.user) throw new NotFoundError("User");
    const user = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        phone: req.user.phone ?? null,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
        profilePicture: req.user.profilePicture ?? null,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
    }
    successResponse(res, "User was fetched", 200, {  user });
});

export const updateProfile = asyncHandler(async (req, res, _next) => {
    if (!req.user) throw new NotFoundError("User");
    const user = await updateProfileService(req.user.id, req.body);
    successResponse(res, "Profile updated successfully", 200, { user });
});

export const changePassword = asyncHandler(async (req, res, _next) => {
    if (!req.user) throw new NotFoundError("User");
    await changePasswordService(req.user.id, req.body);
    successResponse(res, "Password changed successfully", 200);
});

export const updateProfilePicture = asyncHandler(async (req, res, _next) => {
    if (!req.user) throw new NotFoundError("User");
    if (!req.file) throw new AppError("Please provide a profile image", 400);
    const user = await updateProfilePictureService(req.user.id, req.file.filename);
    successResponse(res, "Profile picture updated successfully", 200, { user });
});

export const removeProfilePicture = asyncHandler(async (req, res, _next) => {
    if (!req.user) throw new NotFoundError("User");
    const user = await removeProfilePictureService(req.user.id);
    successResponse(res, "Profile picture removed successfully", 200, { user });
});
