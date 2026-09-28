import { prisma } from "@/lib/prisma";
import { DepositRequestRepository } from "@/repositories/deposit.request.repository";
import { WalletRepository } from "@/repositories/wallet.repository";
import { WalletTransactionRepository } from "@/repositories/wallet.transaction.repository";
import { AppError } from "@/utils/app.error";
import { DepositRequestStatus, TransactionType } from "../../../generated/prisma/enums";
import type {
    DepositRequestQuery,
    DepositSchema,
    TenantDepositRequestQuery,
    TransactionQuery,
} from "./wallet.validation";

export const getMyWalletService = async (userId: string) => {
    return WalletRepository.createIfNotExist(userId)
}

export const depositService = async (userId: string, data: DepositSchema) => {
    const { ammount, paymentMethod, transactionId } = data;

    const duplicate = await DepositRequestRepository.findPendingByTransactionRef(userId, transactionId);
    if (duplicate) throw new AppError('This transaction reference is already under review', 409);

    return prisma.$transaction(async (tx) => {
        await WalletRepository.createIfNotExist(userId, tx);
        return DepositRequestRepository.create({ userId, ammount, paymentMethod, transactionId }, tx);
    })
}

export const approveDepositRequestService = async (id: string) => {
    return prisma.$transaction(async (tx) => {
        const deposit = await DepositRequestRepository.findById(id, tx);
        if (!deposit) throw new AppError('Deposit request not found', 404);

        const claimed = await DepositRequestRepository.claimPending(id, DepositRequestStatus.APPROVED, tx);
        if (claimed.count !== 1) {
            throw new AppError(`Deposit request is already ${deposit.status.toLowerCase()}`, 400);
        }

        const ammount = Number(deposit.ammount);
        await WalletRepository.createIfNotExist(deposit.userId, tx);
        const wallet = await WalletRepository.increaseBalance(deposit.userId, ammount, tx);

        await WalletTransactionRepository.create({
            walletId: wallet.id,
            type: TransactionType.DEPOSIT,
            ammount,
            balanceAfter: Number(wallet.balance)
        }, tx);

        return deposit;
    })
}

export const rejectDepositRequestService = async (id: string) => {
    return prisma.$transaction(async (tx) => {
        const deposit = await DepositRequestRepository.findById(id, tx);
        if (!deposit) throw new AppError('Deposit request not found', 404);

        const claimed = await DepositRequestRepository.claimPending(id, DepositRequestStatus.REJECTED, tx);
        if (claimed.count !== 1) {
            throw new AppError(`Deposit request is already ${deposit.status.toLowerCase()}`, 400);
        }

        return deposit;
    })
}

export const getWalletTransactionsService = async (userId: string, query: TransactionQuery) => {
    const { page, limit, type } = query;
    const skip = (page - 1) * limit;

    const wallet = await WalletRepository.createIfNotExist(userId);
    const { walletTransactions, totalCount } = await WalletTransactionRepository.findPaginatedByWalletId(
        wallet.id,
        { type },
        skip,
        limit
    );

    return { walletTransactions, totalPages: Math.ceil(totalCount / limit), totalCount };
}

export const getTenantDepositRequestsService = async (userId: string, query: TenantDepositRequestQuery) => {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const { depositRequests, totalCount } = await DepositRequestRepository.findPaginatedByTenantId(
        userId,
        { status },
        skip,
        limit
    );

    return { depositRequests, totalPages: Math.ceil(totalCount / limit), totalCount };
}

export const getAllDepositRequestsService = async (query: DepositRequestQuery) => {
    const { page, limit, status, search } = query;
    const skip = (page - 1) * limit;

    const { depositRequests, totalCount } = await DepositRequestRepository.findAll(
        { status, search },
        skip,
        limit
    );

    return { depositRequests, totalPages: Math.ceil(totalCount / limit), totalCount };
}
