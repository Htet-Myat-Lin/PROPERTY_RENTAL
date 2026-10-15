export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export interface IAdminUser {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  profilePicture: string | null;
  active: boolean;
  createdAt: string;
  walletBalance: number;
  propertyCount: number;
  activeRentals: number;
  rentRequestCount: number;
  reviewCount: number;
}

export interface IAdminUsersResult {
  users: IAdminUser[];
  totalPages: number;
  totalCount: number;
}

export interface AdminUserFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}