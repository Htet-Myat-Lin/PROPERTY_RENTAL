import { LandlordTenantApi } from "@/api/services/landlord-tenant-service";
import { useQuery } from "@tanstack/react-query";
import type { LandlordTenantFilters } from "../types";

/** Landlord-only list of tenants, driven by URL filters. */
export const useGetLandlordTenants = (filters: LandlordTenantFilters) => {
  return useQuery({
    queryKey: ["landlord", "tenants", filters],
    queryFn: () => LandlordTenantApi.getTenants(filters),
  });
};