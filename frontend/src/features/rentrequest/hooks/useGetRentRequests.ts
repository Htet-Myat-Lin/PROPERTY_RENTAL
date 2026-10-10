import { RentRequestApi } from "@/api/services/rentrequest-service";
import type { RentRequestFilters } from "@/features/rentrequest/types";
import { useQuery } from "@tanstack/react-query";

/**
 * One hook for both dashboards. The server picks the list by the caller's role,
 * so the endpoint is derived from the role rather than passed in by the caller.
 */
export const useGetRentRequests = (role: string | undefined, filters: RentRequestFilters) => {
  const isLandlord = role === "LANDLORD";

  return useQuery({
    queryKey: ["rent-requests", isLandlord ? "landlord" : "tenant", filters],
    queryFn: () =>
      isLandlord ? RentRequestApi.getLandlordRequests(filters) : RentRequestApi.getMyRequests(filters),
    enabled: Boolean(role),
  });
};