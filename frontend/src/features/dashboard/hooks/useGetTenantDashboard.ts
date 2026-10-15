import { DashboardApi } from "@/api/services/dashboard-service";
import { useQuery } from "@tanstack/react-query";

/** Tenant-only landing rollup: current rental, wishlist, bookings, and requests. */
export const useGetTenantDashboard = () => {
  return useQuery({
    queryKey: ["dashboard", "tenant"],
    queryFn: () => DashboardApi.getTenantDashboard(),
  });
};
