import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async.handler.js";
import { PropertyService } from "../services/property.service.js";
import fs from "node:fs";
import { AppError } from "../utils/app.error.js";
import type { AuthRequest } from "../utils/types.js";

export const getLandlordProperties = asyncHandler(async(req, res, next)=> {
  const userId = req.user?._id
  if (!userId) throw new AppError("UserId required", 401)
  const properties = await PropertyService.getPropertiesByLandlord(userId as unknown as string)
  res.status(200).json({ success: true, message: "Properties fetched successfully", properties })
})

export const getProperty = asyncHandler(async(req, res, next) => {
  const property = await PropertyService.getPropertyById(req.params.id as unknown as string)
  if(!property) throw new AppError("Property not found", 404)
  res.status(200).json({ success: true, message: "Property was fetched", property })
})

export const createProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id
  if (!userId) throw new AppError("UserId required", 401)

  const files = (req.files as Express.Multer.File[]) || [];
  let { location } = req.body;
  try {
    if (typeof location === "string") {
      location = JSON.parse(location);
    }

    const images = files?.map((file) => file.filename);

    const property = await PropertyService.createProperty({
      ...req.body,
      images,
      location,
      user: userId
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

export const editProperty = async(
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {id} = req.params
  const files = (req.files as Express.Multer.File[]) || []
  
  try{
    const property = await PropertyService.getPropertyById(id as unknown as string)
    if(!property) throw new AppError("Property not found", 404)

    if(typeof req.body.location === "string") req.body.location = JSON.parse(req.body.location)
    if(typeof req.body.existingImages === "string") req.body.existingImages = JSON.parse(req.body.existingImages)
    
    const existingImages = req.body.existingImages || []

    if((files.length + existingImages.length) > 1) throw new AppError("Maximum 5 images allowed", 400)

    const imagesToDelete = property.images.filter((img) => !existingImages.includes(img))

    imagesToDelete.forEach((img) => {
      const imgPath = `src/uploads/property-images/${img}`
      if(fs.existsSync(imgPath)) fs.unlink(imgPath, () => {})
    })

    const newImages = files.map((file) => file.filename)
    const finalImageList = [...newImages, ...existingImages]

    const updatedProperty = await PropertyService.updateProperty(id as string, {...req.body, images: finalImageList})

    res.status(200).json({ success: true, property: updatedProperty, message: "Property updated successfully" })
  } catch(err) {
    if (files.length) {
      files.forEach((file) => {
        if(fs.existsSync(file.path)){
          fs.unlink(file.path, () => {})
        }
      })
    }
    next(err)
  }
}

export const deleteProperty = asyncHandler(async(req, res, next) => {
  const { id } = req.params
  await PropertyService.deleteProperty(id as unknown as string)
  res.status(200).json({ success: true, message: "Property deleted successfully" })
})
