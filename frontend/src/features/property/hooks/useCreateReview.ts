import axios from 'axios';
import { ReviewApi } from "@/api/services/review-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateReview = (propetyId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ comment, rating }: { comment: string; rating: number }) =>
      ReviewApi.createReview(rating, comment, propetyId),
    onSuccess: async () => {
      toast.success("Review was created successfully");
      await queryClient.invalidateQueries({ queryKey: ["reviews", propetyId] });
    },

    onError: (err) => {
        console.log(err)
      let errMsg = "Something went wrong"
      if (axios.isAxiosError(err)) errMsg = err?.response?.data?.message
      toast.error(errMsg);
    }
  });
};
