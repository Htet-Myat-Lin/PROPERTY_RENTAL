import { protect } from "@/middleware/auth.middleware";
import { Router } from "express";
import { createReview, deleteReview, getReviewsByPropertyId, getReviewsByUserId, updateReview } from "./review.controller";
const router = Router();
router.route("/properties/:propertyId")
    .post(protect, createReview)
    .get(getReviewsByPropertyId);
router.get("/users/:userId", protect, getReviewsByUserId);
router.route("/:id")
    .patch(protect, updateReview)
    .delete(protect, deleteReview);
export { router as reviewRouter };
