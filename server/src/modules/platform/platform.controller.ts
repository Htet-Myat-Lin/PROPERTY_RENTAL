import type { AuthRequest } from "@/types/types";
import { asyncHandler } from "@/utils/async.handler";
import { successResponse } from "@/utils/api.response";
import type { NextFunction, Response } from "express";
import { getAdminDashboardService, getPlatformSummaryService } from "./platform.service";

export const getPlatformSummary = asyncHandler(async(_req: AuthRequest, res: Response, _next: NextFunction) => {
    const summary = await getPlatformSummaryService();
    successResponse(res, 'Platform summary fetched', 200, { summary })
})

export const getAdminDashboard = asyncHandler(async(_req: AuthRequest, res: Response, _next: NextFunction) => {
    const dashboard = await getAdminDashboardService();
    successResponse(res, 'Admin dashboard fetched', 200, { dashboard })
})
