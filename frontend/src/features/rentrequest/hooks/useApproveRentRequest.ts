import { RentRequestApi } from "@/api/services/rentrequest-service";
import { getApiErrorMessage } from "@/utils/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useApproveRentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, decisionReason }: { id: string; decisionReason?: string }) =>
      RentRequestApi.approve(id, decisionReason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rent-requests"] });
      // Approval debits the tenant's wallet, so any cached balance is stale.
      await queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success("Rent request approved — deposit moved into escrow");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Could not approve the rent request"));
    },
  });
};