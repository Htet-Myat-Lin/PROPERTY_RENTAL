import type { Request } from "express";
import { Document, type Model, type Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string | undefined;
  active?: boolean;
  isEmailVerified?: boolean;
  verifyOTP?: string | undefined;
  verifyOTPExpiry?: number | undefined;
  verifyOTPGeneratedAt?: number | undefined;
  resetPasswordOTP?: string | undefined;
  resetPasswordOTPExpiry?: number | undefined;
  resetPasswordOTPGeneratedAt?: number | undefined;
  role: "TENANT" | "ADMIN" | "LANDLORD";
  profilePictures?: string[] | null;
  refreshToken?: string | undefined;
}

export interface UserMethods {
  comparePassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUser, {}, UserMethods> {}

export interface AuthRequest extends Request {
  user?: IUser;
}

type UtilityType = "INCLUDED" | "FIXED" | "METERED";

export interface IProperty extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  baseRentPrice: number;
  beds: number;
  baths: number;
  area: number;
  propertyType: string;
  status: string;
  location: { type: string; coordinates: [number, number]; address: string };
  images: string[];
  nearTransit: { type: string; distance: number };
  parkingSpaces: number;
  rating: number;
  yearBuilt?: number;
  petAllowed: boolean;
  appliances?: string[];
  availableDate: Date;
  internet?: { name: string; speed: string };
  leaseTermMonths: number;
  utilityFee: {
    electricity: { type: UtilityType; amount?: number };
    water: { type: UtilityType; amount?: number };
    internet?: { type: UtilityType; amount?: number };
    trashCollection?: { type: UtilityType; amount?: number };
  };
}

export type PropertyFilters = {
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  status?: string
}