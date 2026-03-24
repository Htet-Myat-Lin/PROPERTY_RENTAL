import { prisma } from "@/lib/prisma";

export class WishlistRepository {
    static async create(userId: string, propertyId: string) {
        return prisma.wishlist.create({ data: { userId, propertyId } });
    }

    static async delete(userId: string, propertyId: string) {
        return prisma.wishlist.delete({ where: { userId_propertyId: { userId, propertyId } } }); // userId_propertyId is a composite key
    }

    static async findByUserId(userId: string) {
        return prisma.wishlist.findMany({ where: { userId } });
    }
}