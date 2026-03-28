import { ReviewApi } from "@/api/services/review-service";
import { useQuery } from "@tanstack/react-query";

export const useGetUserReviews = (userId: string) => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => ReviewApi.getReviewsByUserId(userId),
  });
};
