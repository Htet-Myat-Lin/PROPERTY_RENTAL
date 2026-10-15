import { PlatformApi } from "@/api/services/platform-service";
import { useQuery } from "@tanstack/react-query";

/** Admin-only landing rollup: counts, charts, and pending queues in one call. */
export const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: ["platform", "dashboard"],
    queryFn: () => PlatformApi.getDashboard(),
  });
};
