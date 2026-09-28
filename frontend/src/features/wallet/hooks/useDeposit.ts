import { WalletApi, type DepositPayload } from "@/api/services/wallet-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DepositPayload) => WalletApi.deposit(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Deposit request submitted for approval");
    },
  });
};
