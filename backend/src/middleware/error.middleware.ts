import type {  Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../utils/app.error.js";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (err instanceof mongoose.Error.ValidationError) {
        const message = Object.values(err.errors).map(err => err.message)[0] as string
        err = new AppError(message, 400)
    }

    if (err.code && err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field?.charAt(0).toUpperCase()}${field?.slice(1)} already exists. Please use a different ${field}.`;
        err = new AppError(message, 400)
    }

    if (err instanceof mongoose.Error.CastError) {
        const message = `Invalid ${err.path}: ${err.value}.`
        err = new AppError(message, 400)
    }

    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token. Please log in again."
        err = new AppError(message, 401)
    }

    if (err.name === "TokenExpiredError") {
        const message = "Token expired. Please log in again"
        err = new AppError(message, 401)
    }

    if (err instanceof AppError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    // Generic error response
    return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later."
    });
}