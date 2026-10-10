import { WalletApi, type WithdrawPayload } from "@/api/services/wallet-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export type { WithdrawPayload };

export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WithdrawPayload) => WalletApi.withdraw(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Withdrawal request submitted for review");
    },
    // Failures are surfaced inside the dialog itself, so no toast here.
  });
};

