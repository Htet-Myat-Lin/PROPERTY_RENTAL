import { prisma } from "@/lib/prisma";
import type { DbClient } from "@/types/types";

export class WalletRepository {
    static async createIfNotExist (userId: string, db: DbClient = prisma) {
        return db.wallet.upsert({
            where: { userId },
            update: {},
            create: { userId }
        })
    }

    static async increaseBalance (userId: string, amount: number, db: DbClient = prisma) {
        return db.wallet.update({
            where: { userId },
            data: {
                balance: { increment: amount }
            }
        })
    }

    static async decreaseBalance (userId: string, amount: number, db: DbClient = prisma) {
        return db.wallet.update({
            where: { userId },
            data: {
                balance: { decrement: amount }
            }
        })
    }

    static async decreaseBalanceIfSufficient (
        userId: string,
        amount: number,
        db: DbClient = prisma
    ) {
        return db.wallet.updateMany({
            where: { userId, balance: { gte: amount } },
            data: { balance: { decrement: amount } }
        })
    }

    static async findByUserId (userId: string, db: DbClient = prisma) {
        return db.wallet.findFirst({
            where: { userId }
        })
    }
}

