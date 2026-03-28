import { ReviewApi } from "@/api/services/review-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteReview = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ReviewApi.deleteReview(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
