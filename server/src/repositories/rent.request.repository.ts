import { prisma } from "@/lib/prisma";
import type { DbClient } from "@/types/types";
import { RentRequestStatus, EscrowStatus } from "../../generated/prisma/enums";

export type RentRequestPayload = {
    userId: string;
    landlordId: string;
    propertyId: string;
    amount: number;
    depositAmount?: number | null;
    startDate: Date;
    endDate: Date;
    durationMonths: number;
    message?: string | null;
}

export type RentRequestUpdatePayload = {
    amount: number;
    depositAmount?: number | null;
    startDate: Date;
    endDate: Date;
    durationMonths: number;
    message?: string | null;
}

export type RentRequestFilters = {
    status?: RentRequestStatus;
    propertyId?: string;
    escrowStatus?: EscrowStatus;
    search?: string;
}

const counterpartySelect = {
    id: true,
    username: true,
    email: true,
    profilePicture: true,
} as const

const propertySelect = {
    id: true,
    title: true,
    baseRentPrice: true,
    status: true,
    locationAddress: true,
} as const

const listInclude = {
    property: { select: propertySelect },
    payments: {
        include: { escrow: true },
        orderBy: { createdAt: "desc" as const },
    },
}

export class RentRequestRepository {
    static async create (payload: RentRequestPayload, db: DbClient = prisma) {
        return db.rentRequest.create({ data: payload })
    }

    static async findById (id: string, db: DbClient = prisma) {
        return db.rentRequest.findUnique({ where: { id } })
    }

    static async findDetailedById (id: string, db: DbClient = prisma) {
        return db.rentRequest.findUnique({
            where: { id },
            include: {
                property: { select: propertySelect },
                user: { select: counterpartySelect },
                landlord: { select: counterpartySelect },
                payments: { include: { escrow: true } },
            },
        })
    }

    /** Guards against a tenant stacking multiple live applications on one property. */
    static async findLiveByUserAndProperty (userId: string, propertyId: string, db: DbClient = prisma) {
        return db.rentRequest.findFirst({
            where: {
                userId,
                propertyId,
                status: { in: [RentRequestStatus.PENDING, RentRequestStatus.APPROVED] },
            },
        })
    }

    static async findPaginatedByUserId (
        userId: string,
        filters: RentRequestFilters,
        skip: number,
        limit: number,
        db: DbClient = prisma
    ) {
        const where: Record<string, unknown> = { userId };
        if (filters.status) where.status = filters.status;
        if (filters.propertyId) where.propertyId = filters.propertyId;

        const [rentRequests, totalCount] = await Promise.all([
            db.rentRequest.findMany({
                where,
                include: listInclude,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            db.rentRequest.count({ where }),
        ]);

        return { rentRequests, totalCount };
    }

    static async findPaginatedByLandlordId (
        landlordId: string,
        filters: RentRequestFilters,
        skip: number,
        limit: number,
        db: DbClient = prisma
    ) {
        const where: Record<string, unknown> = { landlordId };
        if (filters.status) where.status = filters.status;
        if (filters.propertyId) where.propertyId = filters.propertyId;

        const [rentRequests, totalCount] = await Promise.all([
            db.rentRequest.findMany({
                where,
                include: {
                    ...listInclude,
                    user: { select: counterpartySelect },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            db.rentRequest.count({ where }),
        ]);

        return { rentRequests, totalCount };
    }

    /**
     * Only one request per property may ever be APPROVED, so approval has to
     * check for a rival before claiming.
     */
    static async findApprovedByPropertyId (propertyId: string, excludeId: string, db: DbClient = prisma) {
        return db.rentRequest.findFirst({
            where: {
                propertyId,
                status: RentRequestStatus.APPROVED,
                id: { not: excludeId },
            },
        })
    }

    /**
     * Admin view across every landlord. `escrowStatus` matches requests that
     * have a payment holding funds in that custody state, which is how the
     * admin release queue is driven.
     */
    static async findPaginatedAll (
        filters: RentRequestFilters,
        skip: number,
        limit: number,
        db: DbClient = prisma
    ) {
        const where: Record<string, unknown> = {};
        if (filters.status) where.status = filters.status;
        if (filters.propertyId) where.propertyId = filters.propertyId;
        if (filters.escrowStatus) {
            where.payments = { some: { escrow: { is: { status: filters.escrowStatus } } } };
        }

        if (filters.search && filters.search.trim().length > 0) {
            const term = filters.search.trim();
            const insensitive = { contains: term, mode: "insensitive" as const };
            where.OR = [
                { property: { is: { title: insensitive } } },
                { user: { is: { username: insensitive } } },
                { landlord: { is: { username: insensitive } } },
            ];
        }

        const [rentRequests, totalCount] = await Promise.all([
            db.rentRequest.findMany({
                where,
                include: {
                    property: { select: propertySelect },
                    user: { select: counterpartySelect },
                    landlord: { select: counterpartySelect },
                    payments: { include: { escrow: true }, orderBy: { createdAt: "desc" } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            db.rentRequest.count({ where }),
        ]);

        return { rentRequests, totalCount };
    }

    /**
     * Compare-and-set on `PENDING`. Returning `count !== 1` means somebody else
     * already decided (or a concurrent request won the race), which callers
     * translate into a 409 instead of a silent double-approval.
     */
    static async claimPending (
        id: string,
        data: {
            status: RentRequestStatus;
            decisionReason?: string | null;
            decidedAt?: Date | null;
        },
        db: DbClient = prisma
    ) {
        return db.rentRequest.updateMany({
            where: { id, status: RentRequestStatus.PENDING },
            data,
        })
    }

    /** Records the generated lease filename so the download route can find it. */
    static async updateLeaseAgreement (id: string, fileName: string, db: DbClient = prisma) {
        return db.rentRequest.update({
            where: { id },
            data: { leaseAgreement: fileName, leaseGeneratedAt: new Date() },
        })
    }

    static async updatePendingByTenant (
        id: string,
        userId: string,
        data: RentRequestUpdatePayload,
        db: DbClient = prisma
    ) {
        return db.rentRequest.updateMany({
            where: { id, userId, status: RentRequestStatus.PENDING },
            data,
        })
    }

    static async cancelPendingByTenant (id: string, userId: string, db: DbClient = prisma) {
        return db.rentRequest.updateMany({
            where: { id, userId, status: RentRequestStatus.PENDING },
            data: { status: RentRequestStatus.CANCELLED, decidedAt: new Date() },
        })
    }
}