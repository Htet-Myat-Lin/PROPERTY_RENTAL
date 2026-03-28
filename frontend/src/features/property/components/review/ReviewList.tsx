import { Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { useGetPropertyReviews } from "../../hooks/useGetPropertyReviews";
import { ReviewCard } from "./ReviewCard";
import { useAppStore } from "@/app/store";

type Review = {
  id: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt: string;
  userId: string;
};

export function ReviewList({ propertyId }: { propertyId: string }) {
  const { data, isLoading, error } = useGetPropertyReviews(propertyId);
  const user = useAppStore((state) => state.user);

  if (isLoading) {
    return (
      <VStack py="8">
        <Spinner size="lg" color="blue.500" />
        <Text color="gray.500">Loading reviews...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Text color="red.500" py="4">
        Failed to load reviews
      </Text>
    );
  }

  const reviews: Review[] = data?.reviews || [];

  if (reviews.length === 0) {
    return (
      <Text color="gray.500" py="4" textAlign="center">
        No reviews yet. Be the first to review this property!
      </Text>
    );
  }

  return (
    <Stack gap="4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={{
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            user: review.user,
            createdAt: new Date(review.createdAt),
            userId: review.userId || user?.id || "",
          }}
        />
      ))}
    </Stack>
  );
}