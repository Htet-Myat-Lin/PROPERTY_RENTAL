import { useAppStore } from "@/app/store";
import { WalletApi } from "@/api/services/wallet-service";
import type { WithdrawalRequestFilters } from "@/features/wallet/types";
import { useQuery } from "@tanstack/react-query";

/** The signed-in user's own withdrawal requests, paginated server-side. */
export const useGetMyWithdrawalRequests = (filters: WithdrawalRequestFilters) => {
  const role = useAppStore((state) => state.user?.role);
  const canWithdraw = role === "TENANT" || role === "LANDLORD";

  return useQuery({
    queryKey: ["wallet", "withdrawal-requests", "mine", filters],
    queryFn: () => WalletApi.getMyWithdrawalRequests(filters),
    enabled: canWithdraw,
  });
};
