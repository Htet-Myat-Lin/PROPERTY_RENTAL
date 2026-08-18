import { prisma } from "@/lib/prisma";
export class UserRepository {
    static async create(data) {
        return prisma.user.create({ data });
    }
    static async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
    static async findById(id) {
        return prisma.user.findUnique({ where: { id } });
    }
    static async updateRefreshToken(id, refreshToken) {
        return prisma.user.update({
            where: { id },
            data: { refreshToken },
            select: {
                id: true,
                username: true,
                email: true,
                isEmailVerified: true,
                role: true,
                profilePicture: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    static async verifyEmail(userId) {
        // return the promise so callers can await completion
        return prisma.user.update({
            where: { id: userId },
            data: {
                isEmailVerified: true,
                verifyOTP: null,
                verifyOTPExpiry: 0,
                verifyOTPGeneratedAt: 0,
            },
        });
    }
    static async resetPassword(userId, password) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                password,
                resetPasswordOTP: null,
                resetPasswordOTPExpiry: 0,
                resetPasswordOTPGeneratedAt: 0,
            },
        });
    }
    static async saveVerifyOTP(userId, hashedOTP, expiry, generatedAt) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                verifyOTP: hashedOTP,
                verifyOTPExpiry: expiry,
                verifyOTPGeneratedAt: generatedAt,
            },
        });
    }
    static async clearVerifyOTP(userId) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                verifyOTP: null,
                verifyOTPExpiry: 0,
                verifyOTPGeneratedAt: 0,
            },
        });
    }
    static async saveResetPasswordOTP(userId, hashedOTP, expiry, generatedAt) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                resetPasswordOTP: hashedOTP,
                resetPasswordOTPExpiry: expiry,
                resetPasswordOTPGeneratedAt: generatedAt,
            },
        });
    }
    static async clearResetPasswordOTP(userId) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                resetPasswordOTP: null,
                resetPasswordOTPExpiry: 0,
                resetPasswordOTPGeneratedAt: 0,
            },
        });
    }
}
