import { protect } from "@/middleware/auth.middleware";
import { Router } from "express";
import { addToWishlist, getUserWishlist, removeFromWishlist } from "./wishlist.controller";
const router = Router();
router.route("/")
    .post(protect, addToWishlist)
    .delete(protect, removeFromWishlist);
router.get("/users/:userId", protect, getUserWishlist);
export { router as wishlistRouter };
