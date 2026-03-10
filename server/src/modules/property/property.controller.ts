import { PropertyFilters } from "@/types/types";
import { asyncHandler } from "@/utils/async.handler";
import {
  createPropertyService,
  deletePropertyService,
  editPropertyService,
  getPropertiesByLandlordService,
} from "./property.service";
import { AppError } from "@/utils/app.error";
import { successResponse } from "@/utils/api.response";
import { PropertyRepository } from "@/repositories/property.repository";
import { Response, NextFunction } from "express";
import { AuthRequest } from "@/types/types";
import fs from "node:fs";

export const getLandlordProperties = asyncHandler(async (req, res, _next) => {
  const filters: PropertyFilters = {};
  if (req.query.search) filters.search = req.query.search as string;
  if (req.query.sortBy) filters.sortBy = req.query.sortBy as string;
  if (req.query.page) filters.page = Number(req.query.page);
  if (req.query.limit) filters.limit = Number(req.query.limit);
  if (req.query.status) filters.status = req.query.status as string;

  const landlordId = req.user?.id;
  if (!landlordId) throw new AppError("User required", 401);

  const { properties, totalPages, totalCount } =
    await getPropertiesByLandlordService(landlordId, filters);
  successResponse(res, "Properties fetched successfully", 200, {
    properties,
    totalPages,
    totalCount,
  });
});

export const getPropertyById = asyncHandler(async (req, res, _next) => {
  const property = await PropertyRepository.findById(req.params.id);
  if (!property) throw new AppError("Property not found", 404);
  successResponse(res, "Property was fetched", 200, property);
});

export const createProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const landlordId = req.user?.id;
  if (!landlordId) throw new AppError("User required", 401);
  const files = (req.files as Express.Multer.File[]) || [];
  try {
    const { property } = await createPropertyService(
      landlordId,
      req.body,
      files,
    );
    successResponse(res, "Property created successfully", 201, property);
  } catch (err) {
    // delete uploaded files if there is an error
    if (files?.length) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlink(file.path, () => {});
      });
    }

    next(err);
  }
};

export const editProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const propertyId = req.params.id;
  const files = (req.files as Express.Multer.File[]) || [];

  try {
    const { property } = await editPropertyService(propertyId, req.body, files);
    successResponse(res, "Property updated successfully", 200, property);
  } catch (err) {
    // delete uploaded files if there is an error
    if (files?.length) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlink(file.path, () => {});
      });
    }

    next(err);
  }
};

export const deleteProperty = asyncHandler (async (req, res, _next) => {
  const { id } = req.params;
  const { message } = await deletePropertyService(id)
  successResponse(res, message, 200);
})

export const bulkDeleteProperties = asyncHandler (async (req, res, _next) => {
  const { ids } = req.body;
  const { message } = await deletePropertyService(ids)
  successResponse(res, message, 200);
})
