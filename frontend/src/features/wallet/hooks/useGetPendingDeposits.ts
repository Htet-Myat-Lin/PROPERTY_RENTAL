import { useAppStore } from "@/app/store";
import { WalletApi } from "@/api/services/wallet-service";
import { useQuery } from "@tanstack/react-query";

/**
 * Total of the tenant's deposits still waiting for admin approval. Requests a
 * single server-filtered page instead of every request, and is disabled for
 * roles that cannot deposit at all.
 */
export const useGetPendingDeposits = () => {
  const role = useAppStore((state) => state.user?.role);
  const isTenant = role === "TENANT";

  const query = useQuery({
    queryKey: ["wallet", "deposit-requests", "pending-total"],
    queryFn: () => WalletApi.getMyDepositRequests({ status: "PENDING", limit: 100 }),
    enabled: isTenant,
  });

  return {
    pendingAmount: (query.data?.items ?? []).reduce((total, request) => total + request.ammount, 0),
    pendingCount: query.data?.totalCount ?? 0,
    isPending: query.isPending,
    isTenant,
  };
};
