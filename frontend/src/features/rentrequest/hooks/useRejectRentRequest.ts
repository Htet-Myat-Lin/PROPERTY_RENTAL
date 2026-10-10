import { RentRequestApi } from "@/api/services/rentrequest-service";
import { getApiErrorMessage } from "@/utils/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useRejectRentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, decisionReason }: { id: string; decisionReason?: string }) =>
      RentRequestApi.reject(id, decisionReason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rent-requests"] });
      toast.success("Rent request rejected");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Could not reject the rent request"));
    },
  });
};