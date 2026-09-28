import { WalletApi } from "@/api/services/wallet-service";
import { getApiErrorMessage } from "@/utils/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useApproveDepositRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => WalletApi.approveDepositRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Deposit request approved");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Could not approve the deposit request"));
    },
  });
};
