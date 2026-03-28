import { prisma } from "@/lib/prisma";

export class PropertyRepository {
  static async create(data: any) {
    return prisma.property.create({ data });
  }

  static async edit(id: string, data: any) {
    return prisma.property.update({ where: { id }, data })
  }

  static async findByLandlordId(
    queryFilters: any,
    orderBy: any,
    skip: number,
    limit: number,
  ) {
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

  static async findById(id: string) {
    return prisma.property.findUnique({ where: { id }, include: { landlord: { select: { username: true, email: true, profilePicture: true } }}});
  }

  static async delete(id: string) {
    return prisma.property.delete({ where: { id } });
  }

  static async bulkDelete (ids: string[]) {
    return prisma.property.deleteMany({ where: { id: { in: ids } } });
  }

  static async findByIds (ids: string[]) {
    return prisma.property.findMany({ where: { id: { in: ids } } });
  }

  static async findRecommendedProperties (queryFilters: any) {
    return prisma.property.findMany({ where: queryFilters, orderBy: { createdAt: "desc" }, take: 20 });
  }
}
