import { prisma } from "@/lib/prisma";

export class ReviewRepository {
    static async create(data: {
        userId: string;
        propertyId: string;
        rating: number;
        comment: string;
    }) {
        return prisma.review.create({ data });
    }

    static async delete(id: string) {
        return prisma.review.delete({ where: { id } });
    }

    static async findByPropertyId(propertyId: string) {
        return prisma.review.findMany({ where: { propertyId }, include: { user: { select: { username: true, profilePicture: true } }}, orderBy: { createdAt: "desc"} });
    }

    static async findByUserId(userId: string) {
        return prisma.review.findMany({ where: { userId }, include: { user: { select: { username: true, profilePicture: true } } }, orderBy: { createdAt: "desc"} });
    }

    static async edit (id: string, data: { rating: number; comment: string }) {
        return prisma.review.update({ where: { id }, data });
    }
}