import { prisma } from "@/lib/prisma";
export class ReviewRepository {
    static async create(data) {
        return prisma.review.create({ data });
    }
    static async delete(id) {
        return prisma.review.delete({ where: { id } });
    }
    static async findByPropertyId(propertyId) {
        return prisma.review.findMany({ where: { propertyId }, include: { user: { select: { username: true, profilePicture: true } } }, orderBy: { createdAt: "desc" } });
    }
    static async findByUserId(userId) {
        return prisma.review.findMany({ where: { userId }, include: { user: { select: { username: true, profilePicture: true } } }, orderBy: { createdAt: "desc" } });
    }
    static async edit(id, data) {
        return prisma.review.update({ where: { id }, data });
    }
}
