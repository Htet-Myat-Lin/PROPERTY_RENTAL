import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async.handler.js";
import { PropertyService } from "../services/property.service.js";
import fs from "node:fs";
import { AppError } from "../utils/app.error.js";
import type { AuthRequest, PropertyFilters } from "../utils/types.js";

export const getLandlordProperties = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError("User required", 401);

  const filters: PropertyFilters = {};
  if (req.query.search) filters.search = req.query.search as string;
  if (req.query.sortBy) filters.sortBy = req.query.sortBy as string;
  if (req.query.page) filters.page = Number(req.query.page);
  if (req.query.limit) filters.limit = Number(req.query.limit);
  if (req.query.status) filters.status = req.query.status as string;

  const {properties, totalPages} = await PropertyService.getPropertiesByLandlord(
    userId as unknown as string, filters
  );
  res
    .status(200)
    .json({
      success: true,
      message: "Properties fetched successfully",
      properties,
      totalPages
    });
});

export const getProperty = asyncHandler(async (req, res, next) => {
  const property = await PropertyService.getPropertyById(
    req.params.id as unknown as string,
  );
  if (!property) throw new AppError("Property not found", 404);
  res
    .status(200)
    .json({ success: true, message: "Property was fetched", property });
});

export const createProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;
  if (!userId) throw new AppError("UserId required", 401);

  const files = (req.files as Express.Multer.File[]) || [];
  try {
    if (typeof req.body.location === "string") {
      req.body.location = JSON.parse(req.body.location);
    }
    if (typeof req.body.nearTransit === "string") {
      req.body.nearTransit = JSON.parse(req.body.nearTransit);
    }
    if (typeof req.body.internet === "string") {
      req.body.internet = JSON.parse(req.body.internet);
    }
    if (typeof req.body.appliances === "string") {
      req.body.appliances = JSON.parse(req.body.appliances);
    }
    if (typeof req.body.utilityFee === "string") {
      req.body.utilityFee = JSON.parse(req.body.utilityFee);
    }

    const images = files?.map((file) => file.filename);

    const property = await PropertyService.createProperty({
      ...req.body,
      images,
      user: userId,
    });
    return res.status(201).json({ success: true, property });
  } catch (err) {
    if (files?.length) {
      files?.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, () => {});
        }
      });
    }
    next(err);
  }
};

export const editProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const files = (req.files as Express.Multer.File[]) || [];

  try {
    const property = await PropertyService.getPropertyById(
      id as unknown as string,
    );
    if (!property) throw new AppError("Property not found", 404);

    if (typeof req.body.location === "string") {
      req.body.location = JSON.parse(req.body.location);
    }
    if (typeof req.body.existingImages === "string") {
      req.body.existingImages = JSON.parse(req.body.existingImages);
    }
    if (typeof req.body.nearTransit === "string") {
      req.body.nearTransit = JSON.parse(req.body.nearTransit);
    }
    if (typeof req.body.internet === "string") {
      req.body.internet = JSON.parse(req.body.internet);
    }
    if (typeof req.body.appliances === "string") {
      req.body.appliances = JSON.parse(req.body.appliances);
    }
    if (typeof req.body.utilityFee === "string") {
      req.body.utilityFee = JSON.parse(req.body.utilityFee);
    }

    const existingImages = req.body.existingImages || [];

    if (files.length + existingImages.length > 5)
      throw new AppError("Maximum 5 images are allowed to upload.", 400);

    const imagesToDelete = property.images.filter(
      (img) => !existingImages.includes(img),
    );

    imagesToDelete.forEach((img) => {
      const imgPath = `src/uploads/property-images/${img}`;
      if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => {});
    });

    const newImages = files.map((file) => file.filename);
    const finalImageList = [...newImages, ...existingImages];

    const updatedProperty = await PropertyService.updateProperty(id as string, {
      ...req.body,
      images: finalImageList,
    });

    res
      .status(200)
      .json({
        success: true,
        property: updatedProperty,
        message: "Property updated successfully",
      });
  } catch (err) {
    if (files.length) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, () => {});
        }
      });
    }
    next(err);
  }
};

export const deleteProperty = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await PropertyService.deleteProperty(id as unknown as string);
  res
    .status(200)
    .json({ success: true, message: "Property deleted successfully" });
});

export const deleteProperties = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;
  await PropertyService.deleteProperties(ids);
  res
    .status(200)
    .json({ success: true, message: "Properties deleted successfully" });
});
