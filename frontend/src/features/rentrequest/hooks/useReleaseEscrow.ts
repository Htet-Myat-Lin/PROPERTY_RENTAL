import { RentRequestApi } from "@/api/services/rentrequest-service";
import { getApiErrorMessage } from "@/utils/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/** Releases a held deposit to the landlord, which credits their wallet. */
export const useReleaseEscrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => RentRequestApi.releaseEscrow(paymentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rent-requests"] });
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Deposit released to your wallet");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Could not release the escrow"));
    },
  });
};