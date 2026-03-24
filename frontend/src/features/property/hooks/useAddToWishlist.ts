import { WishlistApi } from "@/api/services/wishlist-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAddToWishlist = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) => WishlistApi.addToWishlist(userId, propertyId),
    onSuccess: async () => {
      toast.success("Property was added to wishlist");
      await queryClient.invalidateQueries({
        queryKey: ["wishlist", userId],
      });
    },
  });
};
