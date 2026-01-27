import { PropertyApi } from "@/api/services/property-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteProperties = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: PropertyApi.deleteProperties,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["properties", "landlord"] })
      toast.success("Property was deleted successfully");
    },
  });
};
