import { useAppStore } from "@/app/store";
import { useGetWishlist } from "./useGetWishlist";
import { useAddToWishlist } from "./useAddToWishlist";
import { useRemoveFromWishlist } from "./useRemoveFromWishlist";

type Wishlist = { id: string; userId: string; propertyId: string }

export const useHandleWishlist = () => {
  const user = useAppStore((state) => state.user);
  const { data: wishlistData } = useGetWishlist(user?.id);
  const wishlist = wishlistData?.content?.wishlist;
  const isInWishlist = (propertyId: string) =>
    wishlist?.some((p: Wishlist) => p.propertyId === propertyId);
  const { mutate: addToWishlist } = useAddToWishlist(user?.id);
  const { mutate: removeFromWishlist } = useRemoveFromWishlist(user?.id);
  const toggleSave = (propertyId: string) =>
    isInWishlist(propertyId)
      ? removeFromWishlist(propertyId)
      : addToWishlist(propertyId);

   return { isInWishlist, toggleSave };
};
