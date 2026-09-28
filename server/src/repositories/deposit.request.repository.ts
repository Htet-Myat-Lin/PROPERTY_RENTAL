import { prisma } from "@/lib/prisma";
import type { DbClient } from "@/types/types";
import { DepositRequestStatus } from "../../generated/prisma/enums";

export type DepositPayload = {
    userId: string;
    ammount: number;
    paymentMethod: string;
    transactionId: string;
}

export type DepositRequestFilters = {
    status?: DepositRequestStatus;
    search?: string;
}

const tenantSelect = {
    id: true,
    username: true,
    email: true,
} as const

const buildWhere = (filters: DepositRequestFilters) => {
    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;

    if (filters.search && filters.search.trim().length > 0) {
        const term = filters.search.trim();
        const insensitive = { contains: term, mode: "insensitive" as const };
        where.OR = [
            { transactionId: insensitive },
            { paymentMethod: insensitive },
            { user: { is: { OR: [{ username: insensitive }, { email: insensitive }] } } },
        ];
    }

    return where;
}

export class DepositRequestRepository {
    static async create (payload: DepositPayload, db: DbClient = prisma) {
        return db.depositRequest.create({
            data: payload
        })
    }

    static async findById (id: string, db: DbClient = prisma) {
        return db.depositRequest.findUnique({
            where: { id }
        })
    }

    static async claimPending (id: string, status: DepositRequestStatus, db: DbClient = prisma) {
        return db.depositRequest.updateMany({
            where: { id, status: DepositRequestStatus.PENDING },
            data: { status }
        })
    }

    static async findAll (filters: DepositRequestFilters, skip: number, limit: number, db: DbClient = prisma) {
        const where = buildWhere(filters);

        const [depositRequests, totalCount] = await Promise.all([
            db.depositRequest.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: { user: { select: tenantSelect } },
            }),
            db.depositRequest.count({ where }),
        ]);

        return { depositRequests, totalCount };
    }

    static async findPaginatedByTenantId (
        tenantId: string,
        filters: Pick<DepositRequestFilters, "status">,
        skip: number,
        limit: number,
        db: DbClient = prisma
    ) {
        const where: Record<string, unknown> = { userId: tenantId };
        if (filters.status) where.status = filters.status;

        const [depositRequests, totalCount] = await Promise.all([
            db.depositRequest.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            db.depositRequest.count({ where }),
        ]);

        return { depositRequests, totalCount };
    }

    static async findPendingByTransactionRef (tenantId: string, transactionId: string, db: DbClient = prisma) {
        return db.depositRequest.findFirst({
            where: {
                userId: tenantId,
                transactionId,
                status: DepositRequestStatus.PENDING
            }
        })
    }
}
