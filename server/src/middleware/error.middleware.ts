import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "generated/prisma/client.js";
import { AppError } from "@/utils/app.error";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const fields =
        (err.meta as any)?.target ||
        (err.meta as any)?.driverAdapterError?.cause?.constraint?.fields;

      const fieldName = fields?.join(", ") || "field";
      return res.status(409).json({
        success: false,
        message: `${fieldName} already exists`,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
