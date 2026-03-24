import { WishlistApi } from "@/api/services/wishlist-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useRemoveFromWishlist = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) => WishlistApi.removeFromWishlist(userId, propertyId),
    onSuccess: async () => {
      toast.success("Property was removed from wishlist");
      await queryClient.invalidateQueries({
        queryKey: ["wishlist", userId],
      });
    },
  });
};