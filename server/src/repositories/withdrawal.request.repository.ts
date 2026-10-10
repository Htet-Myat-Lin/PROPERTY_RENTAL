import { prisma } from "@/lib/prisma";
import type { DbClient } from "@/types/types";
import { WithdrawalRequestStatus } from "../../generated/prisma/enums";

export type WithdrawalPayload = {
    userId: string;
    amount: number;
    paymentMethod: string;
}

export type WithdrawalRequestFilters = {
    status?: WithdrawalRequestStatus;
    search?: string;
}

const userSelect = {
    id: true,
    username: true,
    email: true,
} as const

const buildWhere = (filters: WithdrawalRequestFilters) => {
    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;

    if (filters.search && filters.search.trim().length > 0) {
        const term = filters.search.trim();
        const insensitive = { contains: term, mode: "insensitive" as const };
        where.OR = [
            { paymentMethod: insensitive },
            { user: { is: { OR: [{ username: insensitive }, { email: insensitive }] } } },
        ];
    }

    return where;
}

export class WithdrawalRequestRepository {
    static async create (payload: WithdrawalPayload, db: DbClient = prisma) {
        return db.withdrawalRequest.create({
            data: payload
        })
    }

    static async findById (id: string, db: DbClient = prisma) {
        return db.withdrawalRequest.findUnique({
            where: { id }
        })
    }

    static async claimPending (id: string, status: WithdrawalRequestStatus, db: DbClient = prisma) {
        return db.withdrawalRequest.updateMany({
            where: { id, status: WithdrawalRequestStatus.PENDING },
            data: {
                status,
                ...(status === WithdrawalRequestStatus.APPROVED ? { approvedAt: new Date() } : {})
            }
        })
    }

    static async findAll (filters: WithdrawalRequestFilters, skip: number, limit: number, db: DbClient = prisma) {
        const where = buildWhere(filters);

        const [withdrawalRequests, totalCount] = await Promise.all([
            db.withdrawalRequest.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: { user: { select: userSelect } },
            }),
            db.withdrawalRequest.count({ where }),
        ]);

        return { withdrawalRequests, totalCount };
    }

    static async findPaginatedByUserId (
        userId: string,
        filters: Pick<WithdrawalRequestFilters, "status">,
        skip: number,
        limit: number,
        db: DbClient = prisma
    ) {
        const where: Record<string, unknown> = { userId };
        if (filters.status) where.status = filters.status;

        const [withdrawalRequests, totalCount] = await Promise.all([
            db.withdrawalRequest.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            db.withdrawalRequest.count({ where }),
        ]);

        return { withdrawalRequests, totalCount };
    }

    static async findPendingByUserId (userId: string, db: DbClient = prisma) {
        return db.withdrawalRequest.findFirst({
            where: {
                userId,
                status: WithdrawalRequestStatus.PENDING
            }
        })
    }
}
