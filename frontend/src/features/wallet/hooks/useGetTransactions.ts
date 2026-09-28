import { WalletApi } from "@/api/services/wallet-service";
import type { TransactionFilters } from "@/features/wallet/types";
import { useQuery } from "@tanstack/react-query";

/** Paginated wallet ledger for the signed-in tenant or landlord. */
export const useGetTransactions = (filters: TransactionFilters) => {
  return useQuery({
    queryKey: ["wallet", "transactions", filters],
    queryFn: () => WalletApi.getTransactions(filters),
  });
};
