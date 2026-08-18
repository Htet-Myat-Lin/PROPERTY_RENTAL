import { prisma } from "@/lib/prisma";
export class PropertyRepository {
    static async create(data) {
        return prisma.property.create({ data });
    }
    static async edit(id, data) {
        return prisma.property.update({ where: { id }, data });
    }
    static async findByLandlordId(queryFilters, orderBy, skip, limit) {
        const [properties, totalCount] = await Promise.all([
            prisma.property.findMany({
                where: queryFilters,
                include: {
                    landlord: { select: { username: true } },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.property.count({ where: queryFilters }),
        ]);
        return { properties, totalCount };
    }
    static async findById(id) {
        return prisma.property.findUnique({ where: { id }, include: { landlord: { select: { id: true, username: true, email: true, profilePicture: true } } } });
    }
    static async delete(id) {
        return prisma.property.delete({ where: { id } });
    }
    static async bulkDelete(ids) {
        return prisma.property.deleteMany({ where: { id: { in: ids } } });
    }
    static async findByIds(ids) {
        return prisma.property.findMany({ where: { id: { in: ids } } });
    }
    static async findRecommendedProperties(queryFilters) {
        return prisma.property.findMany({ where: queryFilters, orderBy: { createdAt: "desc" }, take: 20 });
    }
}
