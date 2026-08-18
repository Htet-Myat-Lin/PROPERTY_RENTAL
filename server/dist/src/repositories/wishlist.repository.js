import { prisma } from "@/lib/prisma";
export class WishlistRepository {
    static async create(userId, propertyId) {
        return prisma.wishlist.create({ data: { userId, propertyId } });
    }
    static async delete(userId, propertyId) {
        return prisma.wishlist.delete({ where: { userId_propertyId: { userId, propertyId } } }); // userId_propertyId is a composite key
    }
    static async findByUserId(userId) {
        return prisma.wishlist.findMany({ where: { userId } });
    }
}
