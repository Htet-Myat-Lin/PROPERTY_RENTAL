import { PlatformApi } from "@/api/services/platform-service";
import { useQuery } from "@tanstack/react-query";

/** Admin-only rollup of commission earned, escrow position, and user balances. */
export const useGetPlatformSummary = () => {
  return useQuery({
    queryKey: ["platform", "summary"],
    queryFn: () => PlatformApi.getSummary(),
  });
};
