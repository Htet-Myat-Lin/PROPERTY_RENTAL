import { WalletApi } from "@/api/services/wallet-service";
import type { DepositRequestFilters } from "@/features/wallet/types";
import { useQuery } from "@tanstack/react-query";

/** Admin-only list of every tenant deposit request, paginated server-side. */
export const useGetAllDepositRequests = (filters: DepositRequestFilters) => {
  return useQuery({
    queryKey: ["wallet", "deposit-requests", "admin", filters],
    queryFn: () => WalletApi.getAllDepositRequests(filters),
  });
};
