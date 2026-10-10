import { RentRequestApi } from "@/api/services/rentrequest-service";
import type { RentRequestFilters } from "@/features/rentrequest/types";
import { useQuery } from "@tanstack/react-query";

/** Admin-only: every landlord's requests, backing the escrow release queue. */
export const useGetAllRentRequests = (filters: RentRequestFilters) => {
  return useQuery({
    queryKey: ["rent-requests", "admin", filters],
    queryFn: () => RentRequestApi.getAllRequests(filters),
  });
};
