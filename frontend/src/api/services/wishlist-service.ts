import { axiosInstance } from "../axios-instance"

export const WishlistApi = {
    getWishlist: async (userId: string | undefined) => {
        return (await axiosInstance.get(`/wishlist/users/${userId}`)).data
    },

    addToWishlist: async (userId: string | undefined, propertyId: string) => {
        return (await axiosInstance.post(`/wishlist`, { userId, propertyId })).data
    },

    removeFromWishlist: async(userId: string | undefined, propertyId: string) => {
        return await axiosInstance.delete("/wishlist", { data: { userId, propertyId } })
    }
}