import { Router } from "express";
import { acceptBooking, createBooking, getBookingsByLandlordId, getBookingsByTenantId, rejectBooking, updateBookingRemarks } from "./booking.controller";
import { protect, restrictTo } from "@/middleware/auth.middleware";

const router = Router();

router.post("/", protect, restrictTo("TENANT"), createBooking);
router.get("/tenant", protect, restrictTo("TENANT"), getBookingsByTenantId);
router.get("/landlord", protect, restrictTo("LANDLORD"), getBookingsByLandlordId);
router.patch("/:bookingId/accept", protect, restrictTo("LANDLORD"), acceptBooking);
router.patch("/:bookingId/reject", protect, restrictTo("LANDLORD"), rejectBooking);
router.patch("/:bookingId/remarks", protect, restrictTo("LANDLORD"), updateBookingRemarks);

export { router as bookingRouter };