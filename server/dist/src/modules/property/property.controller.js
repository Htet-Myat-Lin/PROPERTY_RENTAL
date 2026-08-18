import { asyncHandler } from "@/utils/async.handler";
import { createPropertyService, deletePropertyService, editPropertyService, getPropertiesService, propertyRecommendationService, } from "./property.service";
import { AppError } from "@/utils/app.error";
import { successResponse } from "@/utils/api.response";
import { PropertyRepository } from "@/repositories/property.repository";
import fs from "node:fs";
import { clearCache } from "@/utils/cache.invalidation";
export const getLandlordProperties = asyncHandler(async (req, res, _next) => {
    const filters = {};
    if (req.query.search)
        filters.search = req.query.search;
    if (req.query.sortBy)
        filters.sortBy = req.query.sortBy;
    if (req.query.page)
        filters.page = Number(req.query.page);
    if (req.query.limit)
        filters.limit = Number(req.query.limit);
    if (req.query.status)
        filters.status = req.query.status;
    const landlordId = req.user?.id;
    if (!landlordId)
        throw new AppError("User required", 401);
    const { properties, totalPages, totalCount } = await getPropertiesService(filters, landlordId);
    successResponse(res, "Properties fetched successfully", 200, {
        properties,
        totalPages,
        totalCount,
    });
});
export const getAllProperties = asyncHandler(async (req, res, _next) => {
    const filters = {};
    if (req.query.search)
        filters.search = req.query.search;
    if (req.query.sortBy)
        filters.sortBy = req.query.sortBy;
    if (req.query.page)
        filters.page = Number(req.query.page);
    if (req.query.limit)
        filters.limit = Number(req.query.limit);
    if (req.query.priceRange)
        filters.priceRange = JSON.parse(req.query.priceRange);
    if (req.query.bedrooms)
        filters.bedrooms = Number(req.query.bedrooms);
    if (req.query.bathrooms)
        filters.bathrooms = Number(req.query.bathrooms);
    if (req.query.propertyTypes)
        filters.propertyTypes = JSON.parse(req.query.propertyTypes);
    if (req.query.leaseTermMonths)
        filters.leaseTermMonths = Number(req.query.leaseTermMonths);
    const { properties, totalPages, totalCount } = await getPropertiesService(filters);
    successResponse(res, "Properties fetched successfully", 200, {
        properties,
        totalPages,
        totalCount,
    });
});
export const getPropertyById = asyncHandler(async (req, res, _next) => {
    const property = await PropertyRepository.findById(req.params.id);
    if (!property)
        throw new AppError("Property not found", 404);
    successResponse(res, "Property was fetched", 200, { property });
});
export const createProperty = async (req, res, next) => {
    const landlordId = req.user?.id;
    if (!landlordId)
        throw new AppError("User required", 401);
    const files = req.files || [];
    try {
        const { property } = await createPropertyService(landlordId, req.body, files);
        // clear cache after creating a new property
        await clearCache("properties");
        successResponse(res, "Property created successfully", 201, property);
    }
    catch (err) {
        // delete uploaded files if there is an error
        if (files?.length) {
            files.forEach((file) => {
                if (fs.existsSync(file.path))
                    fs.unlink(file.path, () => { });
            });
        }
        next(err);
    }
};
export const editProperty = async (req, res, next) => {
    const propertyId = req.params.id;
    const files = req.files || [];
    try {
        const { property } = await editPropertyService(propertyId, req.body, files);
        // clear cache after editing a property
        await clearCache("properties");
        successResponse(res, "Property updated successfully", 200, property);
    }
    catch (err) {
        // delete uploaded files if there is an error
        if (files?.length) {
            files.forEach((file) => {
                if (fs.existsSync(file.path))
                    fs.unlink(file.path, () => { });
            });
        }
        next(err);
    }
};
export const deleteProperty = asyncHandler(async (req, res, _next) => {
    const { id } = req.params;
    const { message } = await deletePropertyService(id);
    // clear cache after deleting a property
    await clearCache("properties");
    successResponse(res, message, 200);
});
export const bulkDeleteProperties = asyncHandler(async (req, res, _next) => {
    const { ids } = req.body;
    const { message } = await deletePropertyService(ids);
    // clear cache after deleting a property
    await clearCache("properties");
    successResponse(res, message, 200);
});
export const getRecommendedProperties = asyncHandler(async (req, res, _next) => {
    const { propertyId } = req.params;
    if (!propertyId)
        throw new AppError("Property id required", 400);
    const { recommendedProperties } = await propertyRecommendationService(propertyId);
    successResponse(res, "Properties fetched successfully", 200, { properties: recommendedProperties });
});
