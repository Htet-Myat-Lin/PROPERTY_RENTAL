import { useAppStore } from "@/app/store";
import { formateDate } from "@/utils/format-date";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { RatingGroup } from "@chakra-ui/react";
import { useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { useDeleteReview } from "../../hooks/useDeleteReview";
import { useUpdateReview } from "../../hooks/useUpdateReview";

type ReviewUser = {
  id: string;
  username: string;
  profilePicture?: string;
};

type Props = {
  id: string;
  rating: number;
  comment: string;
  user: ReviewUser;
  createdAt: Date;
  userId: string;
};

export function ReviewCard({ review }: { review: Props }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const user = useAppStore((state) => state.user);
  const isOwner = review.userId === user?.id;

  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview(review.id);
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(review.id);

  const handleEditClick = () => {
    setEditRating(review.rating);
    setEditComment(review.comment);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSaveEdit = () => {
    if (editRating < 1) {
      toast.error("Rating is required");
      return;
    }
    if (!editComment.trim()) {
      toast.error("Comment is required");
      return;
    }
    updateReview(
      { rating: editRating, comment: editComment },
      {
        onSuccess: () => {
          toast.success("Review updated successfully");
          setIsEditMode(false);
        },
        onError: () => {
          toast.error("Failed to update review");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteReview(undefined, {
      onSuccess: () => {
        toast.success("Review deleted successfully");
        setShowDeleteConfirm(false);
      },
      onError: () => {
        toast.error("Failed to delete review");
      },
    });
  };

  return (
    <Box
      p="4"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      shadow={isEditMode ? "md" : "sm"}
      borderColor={isEditMode ? "green.300" : "gray.200"}
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
      position="relative"
    >
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <Box
          position="absolute"
          inset="0"
          bg="white"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="10"
        >
          <Stack gap="4" align="center">
            <Text fontWeight="medium" fontSize="lg">
              Are you sure you want to delete this review?
            </Text>
            <HStack gap="2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorPalette="red"
                onClick={handleDelete}
                loading={isDeleting}
              >
                Delete
              </Button>
            </HStack>
          </Stack>
        </Box>
      )}

      <Stack gap="2">
        {/* Header - User info and rating */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap="2">
          <HStack gap="3">
            <Avatar.Root size="sm">
              <Avatar.Fallback name={review.user?.username || "User"} />
              {review.user?.profilePicture && (
                <Avatar.Image src={review.user.profilePicture} />
              )}
            </Avatar.Root>
            <Stack gap="0">
              <Text fontWeight="semibold" fontSize="sm">
                {review.user?.username || "Anonymous"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {formateDate(review.createdAt)}
              </Text>
            </Stack>
          </HStack>

          {isEditMode ? (
            <RatingGroup.Root
              count={5}
              value={editRating}
              size="sm"
              colorPalette="orange"
              onValueChange={(e) => setEditRating(e.value)}
            >
              <RatingGroup.HiddenInput />
              <RatingGroup.Control />
            </RatingGroup.Root>
          ) : (
            <RatingGroup.Root
              count={5}
              value={review.rating}
              size="xs"
              colorPalette="orange"
              readOnly
            >
              <RatingGroup.Control />
            </RatingGroup.Root>
          )}
        </Flex>

        {/* Comment - Editable or Display */}
        {isEditMode ? (
          <Box>
            <Textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={3}
              fontSize="sm"
              resize="none"
            />
            <Flex justify="flex-end" gap="2" mt="2">
              <Button
                size="xs"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                colorPalette="green"
                onClick={handleSaveEdit}
                loading={isUpdating}
              >
                Save
              </Button>
            </Flex>
          </Box>
        ) : (
          <Text fontSize="sm" color="gray.700" lineHeight="tall">
            {review.comment}
          </Text>
        )}

        {/* Action Buttons - Edit/Delete */}
        {isOwner && !isEditMode && !showDeleteConfirm && (
          <HStack gap="1" justify="flex-end" mt="1">
            <IconButton
              aria-label="Edit review"
              size="xs"
              variant="ghost"
              colorPalette="green"
              onClick={handleEditClick}
            >
              <FiEdit3 />
            </IconButton>
            <IconButton
              aria-label="Delete review"
              size="xs"
              variant="ghost"
              colorPalette="red"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <FiTrash2 />
            </IconButton>
          </HStack>
        )}
      </Stack>
    </Box>
  );
}
