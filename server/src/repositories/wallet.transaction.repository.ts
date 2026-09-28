import { prisma } from "@/lib/prisma";
import type { DbClient } from "@/types/types";
import { TransactionType } from "../../generated/prisma/enums";

type TransactionPayload = {
    walletId: string;
    type: TransactionType;
    ammount: number;
    balanceAfter: number
}

export type TransactionFilters = {
    type?: TransactionType;
}

export class WalletTransactionRepository {
    static async create (payload: TransactionPayload, db: DbClient = prisma) {
        return db.walletTransaction.create({
            data: payload
        })
    }

    static async findPaginatedByWalletId (
        walletId: string,
        filters: TransactionFilters,
        skip: number,
        limit: number,
        db: DbClient = prisma
    ) {
        const where: Record<string, unknown> = { walletId };
        if (filters.type) where.type = filters.type;

        const [walletTransactions, totalCount] = await Promise.all([
            db.walletTransaction.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            db.walletTransaction.count({ where }),
        ]);

        return { walletTransactions, totalCount };
    }
}
