import { RentRequestApi } from "@/api/services/rentrequest-service";
import type { RentRequestPayload } from "@/features/rentrequest/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateRentRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RentRequestPayload) => RentRequestApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["rent-requests"] });
      toast.success("Rent request sent to the landlord");
    },
  });
};