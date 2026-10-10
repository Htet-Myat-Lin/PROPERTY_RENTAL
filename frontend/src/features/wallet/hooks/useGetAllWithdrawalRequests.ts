import { WalletApi } from "@/api/services/wallet-service";
import type { WithdrawalRequestFilters } from "@/features/wallet/types";
import { useQuery } from "@tanstack/react-query";

/** Admin-only list of every withdrawal request, paginated server-side. */
export const useGetAllWithdrawalRequests = (filters: WithdrawalRequestFilters) => {
  return useQuery({
    queryKey: ["wallet", "withdrawal-requests", "admin", filters],
    queryFn: () => WalletApi.getAllWithdrawalRequests(filters),
  });
};
