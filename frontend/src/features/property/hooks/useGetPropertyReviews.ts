import { ReviewApi } from "@/api/services/review-service"
import { useQuery } from "@tanstack/react-query"

type Review = {
    id: string;
    rating: number;
    comment: string;
    user: {
        id: string;
        username: string;
        profilePicture?: string;
    };
    userId: string;
    createdAt: string;
};

type ReviewsResponse = {
    reviews: Review[];
};

export const useGetPropertyReviews = (propertyId: string) => {
    return useQuery<ReviewsResponse>({
        queryKey: ["reviews", propertyId],
        queryFn: async () => {
            const response = await ReviewApi.getReviewsByPropertyId(propertyId);
            return response.data.content;
        },
    })
}