import { protect, restrictTo } from "@/middleware/auth.middleware"
import { Router } from "express"
import { createProperty, deleteProperty, editProperty, getAllProperties, getLandlordProperties, getPropertyById, getRecommendedProperties } from "./property.controller"
import { upload } from "@/middleware/upload.middleware"
import { cache } from "@/middleware/cache.middleware"
import { validate } from "@/middleware/validation.middleware"
import { propertySchema } from "./property.validation"
import { validatePropertyImages } from "./validate.property.images"

const router = Router()

router.get("/my-properties", protect, restrictTo("LANDLORD"), cache(60, "properties"), getLandlordProperties)

router.route("/")
    .get(getAllProperties)
    .post(protect, restrictTo("LANDLORD"), upload.array("propertyImages", 5), validate(propertySchema), validatePropertyImages, createProperty)

router.route("/:id")
    .get(getPropertyById)
    .patch(protect, restrictTo("LANDLORD"), upload.array("propertyImages", 5), validate(propertySchema), validatePropertyImages, editProperty)
    .delete(protect, restrictTo("LANDLORD"), deleteProperty)

router.get("/:propertyId/recommend", getRecommendedProperties)

export { router as propertyRouter }