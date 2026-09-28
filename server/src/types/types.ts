import { Request } from "express";
import type { Prisma } from "../../generated/prisma/client";

export interface AuthRequest extends Request {
  user?: IUser;
}

// ------------------------------------

export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  active: boolean;
  role: Role;
  profilePicture?: string | null;
  isEmailVerified: boolean;
  verifyOTP?: string | null;
  verifyOTPExpiry: number;
  verifyOTPGeneratedAt: number;
  resetPasswordOTP?: string | null;
  resetPasswordOTPExpiry: number;
  resetPasswordOTPGeneratedAt: number;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ------------------------------------

export enum PropertyType {
  Apartment = "Apartment",
  House = "House",
  Condo = "Condo",
  Villa = "Villa"
}

export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  RENTED = "RENTED",
  RESERVED = "RESERVED"
}

export interface IProperty {
  id: string;
  landlordId: string;
  user?: IUser;
  title: string;
  description: string;
  baseRentPrice: number;
  beds?: number | null;
  baths?: number | null;
  area?: number | null;
  propertyType: PropertyType;
  status: PropertyStatus;
  locationAddress?: string | null;
  coordinates: number[];
  images: string[];
  nearTransitType?: string | null;
  nearTransitDist?: number | null;
  parkingSpaces: number;
  rating: number;
  yearBuilt?: number | null;
  petAllowed: boolean;
  appliances: string[];
  availableDate?: Date | null;
  internetName?: string | null;
  internetSpeed?: string | null;
  leaseTermMonths?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyFilters = {
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  status?: string;
  propertyTypes?: PropertyType[];
  leaseTermMonths?: number;
  bedrooms?: number;
  bathrooms?: number;
  priceRange?: {
    min?: number;
    max?: number;
  }
}

export type PropertyQueryFilters = {
  landlordId: string;
  status?: string;
  title?: string;
  description?: string;
  propertyType?: string;
  locationAddress?: string;
}

// ------------------------------------

/**
 * Either the root prisma client or the transaction-scoped client handed to us
 * by `prisma.$transaction`. `PrismaClient` is structurally assignable to
 * `TransactionClient`, so repository methods can default to the root client
 * and still be called with a transaction when one is required.
 */
export type DbClient = Prisma.TransactionClient;

// ------------------------------------