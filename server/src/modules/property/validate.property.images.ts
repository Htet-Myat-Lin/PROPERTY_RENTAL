import { NextFunction, Request, Response } from "express";

export const validatePropertyImages = (req: Request, res: Response, next: NextFunction) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const hasNewImages = files && files.length > 0;

  let existingImages = [];
  if (typeof req.body.existingImages === "string") {
    existingImages = JSON.parse(req.body.existingImages);
  } else {
    existingImages = req.body.existingImages;
  }
  const hasExistingImages = existingImages?.length > 0;

  if (!hasNewImages && !hasExistingImages) {
    return res.status(400).json({
      success: false,
      message: "At least one image is required",
    });
  }

  next();
};