import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/modules/auth/auth.validation";

const publicUserSelect = {
  id: true,
  username: true,
  email: true,
  phone: true,
  role: true,
  isEmailVerified: true,
  profilePicture: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UserRepository {
  static async create(data: Omit<RegisterSchema, "confirmPassword">) {
    return prisma.user.create({ data });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async updateRefreshToken(id: string, refreshToken: string) {
    return prisma.user.update({
      where: { id },
      data: { refreshToken },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        isEmailVerified: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async updateProfile(id: string, data: { username: string; phone: string | null }) {
    return prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    });
  }

  static async updatePassword(id: string, password: string) {
    return prisma.user.update({
      where: { id },
      data: { password },
      select: publicUserSelect,
    });
  }

  static async updateProfilePicture(id: string, profilePicture: string | null) {
    return prisma.user.update({
      where: { id },
      data: { profilePicture },
      select: publicUserSelect,
    });
  }

  static async verifyEmail(userId: string) {
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

  static async resetPassword(userId: string, password: string) {
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

  static async saveVerifyOTP(
    userId: string,
    hashedOTP: string,
    expiry: number,
    generatedAt: number,
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        verifyOTP: hashedOTP,
        verifyOTPExpiry: expiry,
        verifyOTPGeneratedAt: generatedAt,
      },
    });
  }

  static async clearVerifyOTP(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        verifyOTP: null,
        verifyOTPExpiry: 0,
        verifyOTPGeneratedAt: 0,
      },
    });
  }

  static async saveResetPasswordOTP(
    userId: string,
    hashedOTP: string,
    expiry: number,
    generatedAt: number,
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordOTP: hashedOTP,
        resetPasswordOTPExpiry: expiry,
        resetPasswordOTPGeneratedAt: generatedAt,
      },
    });
  }

  static async clearResetPasswordOTP(userId: string) {
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
