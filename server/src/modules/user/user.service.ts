import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import path from "node:path";
import { UserRepository } from "@/repositories/user.repository";
import { AppError, NotFoundError } from "@/utils/app.error";
import type { ChangePasswordSchema, UpdateProfileSchema } from "./user.validation";

const profileImageDir = path.join(process.env.UPLOAD_DIR ?? "src/uploads", "profile-images");

const deleteProfileImage = async (filename: string | null) => {
    if (!filename) return;
    await fs.unlink(path.join(profileImageDir, filename)).catch(() => undefined);
};

export const updateProfileService = async (userId: string, data: UpdateProfileSchema) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError("User");

    return UserRepository.updateProfile(userId, { username: data.username, phone: data.phone });
};

export const changePasswordService = async (userId: string, data: ChangePasswordSchema) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError("User");

    if (!(await bcrypt.compare(data.currentPassword, user.password))) {
        throw new AppError("Current password is incorrect", 400);
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await UserRepository.updatePassword(userId, hashedPassword);
};

export const updateProfilePictureService = async (userId: string, filename: string) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError("User");

    const updatedUser = await UserRepository.updateProfilePicture(userId, filename);

    if (user.profilePicture && user.profilePicture !== filename) {
        await deleteProfileImage(user.profilePicture);
    }

    return updatedUser;
};

export const removeProfilePictureService = async (userId: string) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError("User");
    if (!user.profilePicture) throw new AppError("You don't have a profile picture to remove", 400);

    const updatedUser = await UserRepository.updateProfilePicture(userId, null);

    await deleteProfileImage(user.profilePicture);

    return updatedUser;
};
