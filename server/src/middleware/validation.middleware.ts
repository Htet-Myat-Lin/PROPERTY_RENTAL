import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        return next(result.error)
    }

    req.body = result.data // sanitized & typed data
    next()
}

export const validateParams = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params)
    if (!result.success) {
        return next(result.error)
    }

    req.params = result.data as Request["params"] // sanitized & typed data
    next()
}