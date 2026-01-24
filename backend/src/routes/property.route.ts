import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { createProperty, getLandlordProperties, getProperty, editProperty, deleteProperty } from "../controllers/property.controller.js";

const router = Router()

router.route("/")
    .post(protect, restrictTo("LANDLORD"), upload.array("propertyImages", 5), createProperty)

router.get("/my-properties", protect, restrictTo("LANDLORD"), getLandlordProperties)

router.route("/:id")
    .get(protect, getProperty)
    .patch(protect, restrictTo("LANDLORD"), upload.array("propertyImages", 5), editProperty)
    .delete(protect, deleteProperty)

export default router