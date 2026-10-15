import type { ApiResponse } from "@/features/wallet/types";
import type { ILandlordTenant, ILandlordTenantsResult, LandlordTenantFilters } from "@/features/landlord-tenants/types";
import { axiosInstance } from "../axios-instance";

const toNumber = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toQueryParams = (filters: LandlordTenantFilters): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `?${query}` : "";
};

const toTenant = (raw: ILandlordTenant): ILandlordTenant => ({
  ...raw,
  monthlyRent: toNumber(raw.monthlyRent),
  amount: toNumber(raw.amount),
});

type ListResponse = {
  tenants: ILandlordTenant[];
  totalPages: number;
  totalCount: number;
};

export const LandlordTenantApi = {
  getTenants: async (filters: LandlordTenantFilters = {}): Promise<ILandlordTenantsResult> => {
    const { data } = await axiosInstance.get<ApiResponse<ListResponse>>(
      `/users/tenants${toQueryParams(filters)}`
    );
    return {
      tenants: data.content.tenants.map(toTenant),
      totalPages: data.content.totalPages,
      totalCount: data.content.totalCount,
    };
  },
};