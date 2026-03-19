import { protect, restrictTo } from "@/middleware/auth.middleware"
import { Router } from "express"
import { createProperty, deleteProperty, editProperty, getLandlordProperties, getPropertyById } from "./property.controller"
import { upload } from "@/middleware/upload.middleware"
import { cache } from "@/middleware/cache.middleware"

const router = Router()

router.get("/my-properties", protect, restrictTo("LANDLORD"), cache(60, "properties"), getLandlordProperties)

router.route("/")
    .post(protect, restrictTo("LANDLORD"), upload.array("propertyImages", 5), createProperty)

router.route("/:id")
    .get(getPropertyById)
    .patch(protect, restrictTo("LANDLORD"), upload.array("propertyImages", 5), editProperty)
    .delete(protect, restrictTo("LANDLORD"), deleteProperty)

export { router as propertyRouter }