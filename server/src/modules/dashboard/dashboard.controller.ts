import type { AuthRequest } from "@/types/types";
import { asyncHandler } from "@/utils/async.handler";
import { successResponse } from "@/utils/api.response";
import { AppError } from "@/utils/app.error";
import type { NextFunction, Response } from "express";
import { getLandlordDashboardService, getTenantDashboardService } from "./dashboard.service";

export const getLandlordDashboard = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const landlordId = req.user?.id;
    if (!landlordId) throw new AppError("Unauthorized", 401);
    const dashboard = await getLandlordDashboardService(landlordId);
    successResponse(res, "Landlord dashboard fetched", 200, { dashboard });
});

export const getTenantDashboard = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError("Unauthorized", 401);
    const dashboard = await getTenantDashboardService(userId);
    successResponse(res, "Tenant dashboard fetched", 200, { dashboard });
});
