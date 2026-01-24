import { Schema, model } from "mongoose";
import type { IUser, IUserModel, UserMethods } from "../utils/types.js";
import { validateEmail } from "../utils/validate.email.js";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser, IUserModel, UserMethods>(
  {
    username: { type: String, minLength: [2, "Username must be at least 2 charachters"], required: [true, "Username is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          return validateEmail(email);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      trim: true,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm Password is required"],
      trim: true,
      validate: {
        validator: function (this:any, confirmPasword: string) {
          return confirmPasword === this.password;
        },
        message: "Passwords do not match",
      },
    },
    active: { type: Boolean, default: true },
    role: { type: String, enum: ["TENANT", "ADMIN", "LANDLORD"], default: "TENANT" },
    profilePictures: { type: [String], default: null },
    isEmailVerified: { type: Boolean, default: false },
    verifyOTP: { type: String, select: false },
    verifyOTPExpiry: { type: Number, default: 0, select: false },
    verifyOTPGeneratedAt: { type: Number, default: 0, select: false },
    resetPasswordOTP: { type: String, select: false },
    resetPasswordOTPExpiry: { type: Number, default: 0, select: false },
    resetPasswordOTPGeneratedAt: { type: Number, default: 0, select: false },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (){
    if (!this.isModified("password")) {
        return
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
})

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export const UserModel = model<IUser, IUserModel>("User", userSchema);
