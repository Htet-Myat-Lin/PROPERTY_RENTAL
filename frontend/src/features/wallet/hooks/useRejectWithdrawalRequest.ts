import { WalletApi } from "@/api/services/wallet-service";
import { getApiErrorMessage } from "@/utils/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useRejectWithdrawalRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => WalletApi.rejectWithdrawalRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Withdrawal rejected");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Could not reject the withdrawal"));
    },
  });
};
