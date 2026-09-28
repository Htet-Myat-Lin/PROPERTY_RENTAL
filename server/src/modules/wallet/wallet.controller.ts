import type { AuthRequest } from "@/types/types";
import { AppError } from "@/utils/app.error";
import { asyncHandler } from "@/utils/async.handler";
import { successResponse } from "@/utils/api.response";
import type { NextFunction, Response } from "express";
import {
    approveDepositRequestService,
    depositService,
    getAllDepositRequestsService,
    getMyWalletService,
    getTenantDepositRequestsService,
    getWalletTransactionsService,
    rejectDepositRequestService,
} from "./wallet.service";
import {
    depositRequestQuerySchema,
    tenantDepositRequestQuerySchema,
    transactionQuerySchema,
} from "./wallet.validation";

// `Wallet.balance` is a BigInt, which JSON.stringify cannot handle
const serializeWallet = (wallet: { id: string; balance: bigint; userId: string; createdAt: Date; updatedAt: Date }) => ({
    ...wallet,
    balance: Number(wallet.balance),
})

export const getMyWallet = asyncHandler(async(req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user?.id
    if (!userId) throw new AppError('Unauthorized', 401);
    const wallet = await getMyWalletService(userId);
    successResponse(res, 'Wallet fetched', 200, { wallet: serializeWallet(wallet) })
})

export const createWalletIfNotExist = asyncHandler(async(req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user?.id
    if (!userId) throw new AppError('Unauthorized', 401);
    const wallet = await getMyWalletService(userId);
    successResponse(res, 'Wallet created!', 200, { wallet: serializeWallet(wallet) })
})

export const deposit = asyncHandler(async(req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user?.id
    if (!userId) throw new AppError('Unauthorized', 401);
    const depositRequest = await depositService(userId, req.body);
    successResponse(res, 'Deposit request submitted for approval', 201, { deposit: depositRequest })
})

export const approveDepositRequest = asyncHandler(async(req: AuthRequest, res: Response, _next: NextFunction) => {
    const { id } = req.params
    await approveDepositRequestService(id);
    successResponse(res, 'Deposit request approved', 200, null);
})

export const rejectDepositRequest = asyncHandler(async(req: AuthRequest, res: Response, _next: NextFunction) => {
    const { id } = req.params
    await rejectDepositRequestService(id);
    successResponse(res, 'Deposit request rejected', 200, null)
})

export const withdrawal = asyncHandler(async(_req: AuthRequest, _res: Response, _next: NextFunction) => {
    throw new AppError('Withdrawal is not available yet', 501)
})

export const getWalletTransactions = asyncHandler(async(req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user?.id
    if (!userId) throw new AppError('Unauthorized', 401);

    const parsed = transactionQuerySchema.safeParse(req.query);
    if (!parsed.success) throw parsed.error;

    const { walletTransactions, totalPages, totalCount } = await getWalletTransactionsService(userId, parsed.data)
    successResponse(res, 'Wallet transactions fetched', 200, { walletTransactions, totalPages, totalCount });
})

export const getAllDepositRequests = asyncHandler(async(req: AuthRequest, res: Response, _next: NextFunction) => {
    const parsed = depositRequestQuerySchema.safeParse(req.query);
    if (!parsed.success) throw parsed.error;

    const { depositRequests, totalPages, totalCount } = await getAllDepositRequestsService(parsed.data);
    successResponse(res, 'All deposit requests fetched', 200, { depositRequests, totalPages, totalCount })
})

export const getDepositRequestsByTenant = asyncHandler(async(req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user?.id
    if (!userId) throw new AppError('Unauthorized', 401);

    const parsed = tenantDepositRequestQuerySchema.safeParse(req.query);
    if (!parsed.success) throw parsed.error;

    const { depositRequests, totalPages, totalCount } = await getTenantDepositRequestsService(userId, parsed.data)
    successResponse(res, 'Tenant deposit requests fetched', 200, { depositRequests, totalPages, totalCount })
})
