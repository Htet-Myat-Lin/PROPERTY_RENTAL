import { prisma } from "@/lib/prisma";

export class WalletRepository {
    static async createIfNotExist (userId: string) {
        return prisma.wallet.upsert({
            where: { userId },
            update: {},
            create: { userId }
        })
    }

    static async increaseBalance (userId: string, ammount: number) {
        return prisma.wallet.update({
            where: { userId },
            data: {
                balance: { increment: ammount }
            }
        })
    }

    static async decreaseBalance (userId: string, ammount: number) {
        return prisma.wallet.update({
            where: { userId },
            data: {
                balance: { decrement: ammount }
            }
        })
    }
}