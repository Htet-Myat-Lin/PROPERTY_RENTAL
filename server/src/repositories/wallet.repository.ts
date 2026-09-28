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

    static async increaseBalance (userId: string, ammount: number, db: DbClient = prisma) {
        return db.wallet.update({
            where: { userId },
            data: {
                balance: { increment: ammount }
            }
        })
    }

    static async decreaseBalance (userId: string, ammount: number, db: DbClient = prisma) {
        return db.wallet.update({
            where: { userId },
            data: {
                balance: { decrement: ammount }
            }
        })
    }

    static async findByUserId (userId: string, db: DbClient = prisma) {
        return db.wallet.findFirst({
            where: { userId }
        })
    }
}
