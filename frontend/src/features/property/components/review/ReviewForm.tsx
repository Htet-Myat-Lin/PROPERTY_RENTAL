import { Button, Field, RatingGroup, Stack, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateReview } from "../../hooks/useCreateReview";

export function ReviewForm({ propertyId } : { propertyId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { mutate, isPending } = useCreateReview(propertyId);

  const handleCreateReview = () => {
    if (rating < 1) return toast.error("Rating is required");
    if (!comment.trim()) return toast.error("Comment is required");
    mutate({ rating, comment }, { onSuccess: () => {
      setRating(0);
      setComment("");
    }});
  }

  return (
    <Stack gap="4">
      {/* Form */}
      <Stack gap="2">
        <RatingGroup.Root
          count={5}
          value={rating}
          size="sm"
          colorPalette="orange"
          onValueChange={(e) => setRating(e.value)}
        >
          <RatingGroup.HiddenInput />
          <RatingGroup.Control />
        </RatingGroup.Root>

        <Field.Root>
          <Textarea focusRingColor="blue.500" placeholder="Share your experience..." onChange={(e) => setComment(e.target.value)} value={comment} rows={3} />
        </Field.Root>

        <Button type="button" disabled={isPending} onClick={handleCreateReview} colorPalette="blue">{isPending ? "Submitting..." : "Submit Review"}</Button>
      </Stack>
    </Stack>
  );
}
