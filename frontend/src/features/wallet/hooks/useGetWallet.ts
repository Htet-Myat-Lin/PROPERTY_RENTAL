import { WalletApi } from "@/api/services/wallet-service";
import { useQuery } from "@tanstack/react-query";

export const useGetWallet = () => {
  const query = useQuery({
    queryKey: ["wallet"],
    queryFn: WalletApi.getMyWallet,
  });

  return {
    wallet: query.data ?? null,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
