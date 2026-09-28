import { useAppStore } from "@/app/store";
import { WalletApi } from "@/api/services/wallet-service";
import type { DepositRequestFilters } from "@/features/wallet/types";
import { useQuery } from "@tanstack/react-query";

/** The signed-in tenant's own deposit requests, paginated server-side. */
export const useGetMyDepositRequests = (filters: DepositRequestFilters) => {
  const role = useAppStore((state) => state.user?.role);
  const isTenant = role === "TENANT";

  return useQuery({
    queryKey: ["wallet", "deposit-requests", "mine", filters],
    queryFn: () => WalletApi.getMyDepositRequests(filters),
    enabled: isTenant,
  });
};
