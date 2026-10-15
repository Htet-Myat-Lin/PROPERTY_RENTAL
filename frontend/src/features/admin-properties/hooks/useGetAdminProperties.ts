import { AdminPropertyApi } from "@/api/services/admin-property-service";
import { useQuery } from "@tanstack/react-query";
import type { AdminPropertyFilters } from "../types";

/** Admin directory of all listings, driven by URL filters. */
export const useGetAdminProperties = (filters: AdminPropertyFilters) => {
  return useQuery({
    queryKey: ["admin", "properties", filters],
    queryFn: () => AdminPropertyApi.getProperties(filters),
  });
};