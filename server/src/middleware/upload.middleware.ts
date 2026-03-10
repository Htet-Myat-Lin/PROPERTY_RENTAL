import multer, { diskStorage, type FileFilterCallback } from "multer";
import type { Request } from "express";
import { AppError } from "../utils/app.error.js";
import path from "node:path";
import { v4 as uuid } from "uuid";

const storage = diskStorage({
  destination: (_req: Request, file: Express.Multer.File, cb) => {
    if (file.fieldname === "propertyImages") {
      cb(null, "src/uploads/property-images/");
    } else if (file.fieldname === "profileImage") {
      cb(null, "src/uploads/profile-images/");
    } else {
      cb(new AppError("Invalid field name from file upload", 400), "");
    }
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const fileName = uuid() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/gif",
    "image/webp",
    "image/apng",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new AppError("Only images are allowed to upload", 400));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
});
