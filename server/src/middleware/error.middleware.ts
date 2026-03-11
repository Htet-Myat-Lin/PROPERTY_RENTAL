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
      status: "error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
        error: e
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
        status: "error",
        message: `${fieldName} already exists`,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Record not found",
      });
    }
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    error: err,
    status: "error",
    message: "Internal server error",
  });
}
