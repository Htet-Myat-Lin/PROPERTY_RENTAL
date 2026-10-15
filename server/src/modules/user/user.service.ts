import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import path from "node:path";
import { UserRepository } from "@/repositories/user.repository";
import { AppError, NotFoundError } from "@/utils/app.error";
import { prisma } from "@/lib/prisma";
import { RentRequestStatus } from "../../../generated/prisma/enums";
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

export type LandlordTenantsFilters = {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
};

/**
 * The landlord's tenants: one row per distinct user who has an APPROVED rent
 * request on one of the landlord's properties. Picks the latest request per
 * tenant, so past and current leases both show up.
 */
export const getLandlordTenantsService = async (
    landlordId: string,
    { search = "", status = "", page = 1, limit = 10 }: LandlordTenantsFilters = {},
) => {
    const now = new Date();

    const searchFilter = search
        ? {
              OR: [
                  { user: { username: { contains: search, mode: "insensitive" as const } } },
                  { user: { email: { contains: search, mode: "insensitive" as const } } },
                  { property: { title: { contains: search, mode: "insensitive" as const } } },
              ],
          }
        : {};

    const requests = await prisma.rentRequest.findMany({
        where: { landlordId, status: RentRequestStatus.APPROVED, ...searchFilter },
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { id: true, username: true, email: true, phone: true, profilePicture: true } },
            property: { select: { id: true, title: true, baseRentPrice: true, images: true } },
        },
    });

    // Keep only the most recent request per tenant.
    const latestByTenant = new Map<string, (typeof requests)[number]>();
    for (const request of requests) {
        if (!latestByTenant.has(request.userId)) latestByTenant.set(request.userId, request);
    }

    let tenants = [...latestByTenant.values()];
    if (status === "ACTIVE") tenants = tenants.filter((request) => request.endDate >= now);
    if (status === "PAST") tenants = tenants.filter((request) => request.endDate < now);

    const totalCount = tenants.length;
    const items = tenants.slice((page - 1) * limit, page * limit);

    return {
        tenants: items.map((request) => ({
            requestId: request.id,
            id: request.user.id,
            username: request.user.username,
            email: request.user.email,
            phone: request.user.phone,
            profilePicture: request.user.profilePicture,
            propertyId: request.property.id,
            propertyTitle: request.property.title,
            propertyImage: request.property.images[0] ?? null,
            monthlyRent: request.property.baseRentPrice,
            amount: Number(request.amount),
            startDate: request.startDate,
            endDate: request.endDate,
            durationMonths: request.durationMonths,
            isActive: request.endDate >= now,
            requestedAt: request.createdAt,
        })),
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        totalCount,
    };
};
