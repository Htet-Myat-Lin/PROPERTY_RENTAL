import { prisma } from "@/lib/prisma";
import type { DbClient } from "@/types/types";
import { PaymentStatus } from "../../generated/prisma/enums";

export type PaymentPayload = {
    rentRequestId: string;
    amount: number;
    landlordAmount: number;
    commissionAmount: number;
}

export class PaymentRepository {
    static async create (payload: PaymentPayload, db: DbClient = prisma) {
        return db.payment.create({ data: payload })
    }

    static async findById (id: string, db: DbClient = prisma) {
        return db.payment.findUnique({
            where: { id },
            include: { escrow: true, rentRequest: { select: { id: true, propertyId: true } } },
        })
    }

    static async findByRentRequestId (rentRequestId: string, db: DbClient = prisma) {
        return db.payment.findMany({
            where: { rentRequestId },
            include: { escrow: true },
            orderBy: { createdAt: "desc" },
        })
    }

    static async markCompleted (id: string, db: DbClient = prisma) {
        return db.payment.update({
            where: { id },
            data: { status: PaymentStatus.COMPLETED },
        })
    }

    static async markFailed (id: string, db: DbClient = prisma) {
        return db.payment.update({
            where: { id },
            data: { status: PaymentStatus.FAILED },
        })
    }
}