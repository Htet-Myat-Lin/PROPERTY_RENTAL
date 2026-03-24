import { WishlistApi } from "@/api/services/wishlist-service";
import { useQuery } from "@tanstack/react-query";

export const useGetWishlist = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["wishlist", userId],
    queryFn: () => WishlistApi.getWishlist(userId),
  });
};
