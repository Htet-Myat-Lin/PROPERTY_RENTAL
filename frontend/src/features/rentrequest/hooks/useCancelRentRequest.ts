import { RentRequestApi } from "@/api/services/rentrequest-service";
import { getApiErrorMessage } from "@/utils/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCancelRentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => RentRequestApi.cancel(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rent-requests"] });
      toast.success("Rent request cancelled");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Could not cancel the rent request"));
    },
  });
};