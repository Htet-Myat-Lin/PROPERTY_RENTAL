import { RentRequestApi } from "@/api/services/rentrequest-service";
import { getApiErrorMessage } from "@/utils/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/** Admin-only: returns a held deposit to the tenant's wallet. */
export const useRefundEscrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => RentRequestApi.refundEscrow(paymentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rent-requests"] });
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Deposit refunded to the tenant");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Could not refund the escrow"));
    },
  });
};