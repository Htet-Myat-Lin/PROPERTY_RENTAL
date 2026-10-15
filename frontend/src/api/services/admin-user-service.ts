import type { ApiResponse } from "@/features/wallet/types";
import type { AdminUserFilters, IAdminUser, IAdminUsersResult } from "@/features/users/types";
import { axiosInstance } from "../axios-instance";

const toNumber = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toQueryParams = (filters: AdminUserFilters): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `?${query}` : "";
};

const toAdminUser = (raw: IAdminUser): IAdminUser => ({
  ...raw,
  walletBalance: toNumber(raw.walletBalance),
  propertyCount: toNumber(raw.propertyCount),
  activeRentals: toNumber(raw.activeRentals),
  rentRequestCount: toNumber(raw.rentRequestCount),
  reviewCount: toNumber(raw.reviewCount),
});

type ListResponse = {
  users: IAdminUser[];
  totalPages: number;
  totalCount: number;
};

export const AdminUserApi = {
  getUsers: async (filters: AdminUserFilters = {}): Promise<IAdminUsersResult> => {
    const { data } = await axiosInstance.get<ApiResponse<ListResponse>>(
      `/admin/users${toQueryParams(filters)}`
    );
    return {
      users: data.content.users.map(toAdminUser),
      totalPages: data.content.totalPages,
      totalCount: data.content.totalCount,
    };
  },
};