import { WishlistRepository } from "@/repositories/wishlist.repository";
import { successResponse } from "@/utils/api.response";
import { AppError } from "@/utils/app.error";
import { asyncHandler } from "@/utils/async.handler";

export const addToWishlist = asyncHandler(async (req, res, _next) => {
    const { userId, propertyId } = req.body;
    if (!userId || !propertyId) throw new AppError("UserId and propertyId required", 401);
    const wishlist = await WishlistRepository.create(userId, propertyId);
    successResponse(res, "Property added to wishlist", 201, { wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res, _next) => {
    const { userId, propertyId } = req.body;
    if (!userId || !propertyId) throw new AppError("UserId and propertyId required", 401);
    await WishlistRepository.delete(userId, propertyId);
    successResponse(res, "Property removed from wishlist", 200);
})

export const getUserWishlist = asyncHandler(async (req, res, _next) => {
    const { userId } = req.params;
    if (!userId) throw new AppError("UserId required", 401);
    const wishlist = await WishlistRepository.findByUserId(userId);
    successResponse(res, "Wishlist was fetched", 200, { wishlist });
})