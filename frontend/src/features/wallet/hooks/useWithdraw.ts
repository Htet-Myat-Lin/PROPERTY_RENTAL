import { WalletApi } from "@/api/services/wallet-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export type WithdrawPayload = {
  ammount: number;
  paymentMethod: string;
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WithdrawPayload) => WalletApi.withdraw(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Withdrawal submitted");
    },
    // Failures are surfaced inside the dialog itself, so no toast here.
  });
};
