import type { ApiResponse } from "@/features/wallet/types";
import type { AdminPropertyFilters, IAdminPropertiesResult, IAdminProperty } from "@/features/admin-properties/types";
import { axiosInstance } from "../axios-instance";

const toNumber = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toQueryParams = (filters: AdminPropertyFilters): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `?${query}` : "";
};

const toAdminProperty = (raw: IAdminProperty): IAdminProperty => ({
  ...raw,
  baseRentPrice: toNumber(raw.baseRentPrice),
  beds: raw.beds === null ? null : toNumber(raw.beds),
  baths: raw.baths === null ? null : toNumber(raw.baths),
  area: raw.area === null ? null : toNumber(raw.area),
  rating: raw.rating === null ? null : toNumber(raw.rating),
  reviewCount: toNumber(raw.reviewCount),
  openRequests: toNumber(raw.openRequests),
});

type ListResponse = {
  properties: IAdminProperty[];
  totalPages: number;
  totalCount: number;
};

export const AdminPropertyApi = {
  getProperties: async (filters: AdminPropertyFilters = {}): Promise<IAdminPropertiesResult> => {
    const { data } = await axiosInstance.get<ApiResponse<ListResponse>>(
      `/admin/properties${toQueryParams(filters)}`
    );
    return {
      properties: data.content.properties.map(toAdminProperty),
      totalPages: data.content.totalPages,
      totalCount: data.content.totalCount,
    };
  },
};