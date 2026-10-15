import { DashboardApi } from "@/api/services/dashboard-service";
import { useQuery } from "@tanstack/react-query";

/** Landlord-only landing rollup: properties, earnings, and pending queues. */
export const useGetLandlordDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "landlord"],
    queryFn: () => DashboardApi.getLandlordDashboard(),
  });
};
