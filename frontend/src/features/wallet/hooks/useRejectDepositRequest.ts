import { WalletApi } from "@/api/services/wallet-service";
import { getApiErrorMessage } from "@/utils/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useRejectDepositRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => WalletApi.rejectDepositRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wallet", "deposit-requests"] });
      toast.success("Deposit request rejected");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Could not reject the deposit request"));
    },
  });
};
