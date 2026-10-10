import { prisma } from "@/lib/prisma";
import type { DbClient } from "@/types/types";
import { EscrowStatus } from "../../generated/prisma/enums";

export type EscrowPayload = {
    paymentId: string;
    amount: number;
}

export class EscrowRepository {
    static async create (payload: EscrowPayload, db: DbClient = prisma) {
        return db.escrow.create({ data: payload })
    }

    static async findByPaymentId (paymentId: string, db: DbClient = prisma) {
        return db.escrow.findUnique({ where: { paymentId } })
    }

    /** Hands the held funds to the landlord. Guarded on PENDING so escrow cannot be released twice. */
    static async release (paymentId: string, releaseDate: Date, db: DbClient = prisma) {
        return db.escrow.updateMany({
            where: { paymentId, status: EscrowStatus.PENDING },
            data: { status: EscrowStatus.RELEASED, releaseDate },
        })
    }

    static async refund (paymentId: string, releaseDate: Date, db: DbClient = prisma) {
        return db.escrow.updateMany({
            where: { paymentId, status: EscrowStatus.PENDING },
            data: { status: EscrowStatus.REFUNDED, releaseDate },
        })
    }
}