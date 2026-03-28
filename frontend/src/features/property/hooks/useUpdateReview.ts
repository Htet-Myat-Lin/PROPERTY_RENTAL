import { ReviewApi } from "@/api/services/review-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateReview = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rating, comment }: { rating: number; comment: string }) =>
      ReviewApi.updateReview(id, rating, comment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
