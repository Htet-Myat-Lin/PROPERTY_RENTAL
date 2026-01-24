import { UserModel } from "../models/user.model.js";
import type { IUser, UserMethods } from "../utils/types.js";

export class UserService {
    static async createUser(userData: IUser): Promise<IUser> {
        const user = new UserModel(userData);
        await user.save();
        return user;
    }

    static async getUserByEmail(email: string): Promise<IUser & UserMethods | null> {
        return await UserModel.findOne({ email }).select("+password +verifyOTP +verifyOTPExpiry +verifyOTPGeneratedAt +resetPasswordOTP +resetPasswordOTPExpiry +resetPasswordOTPGeneratedAt +refreshToken");
    }

    static async getUserById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId).select("+password +verifyOTP +verifyOTPExpiry +verifyOTPGeneratedAt +resetPasswordOTP +resetPasswordOTPExpiry +resetPasswordOTPGeneratedAt +refreshToken");
    }
}