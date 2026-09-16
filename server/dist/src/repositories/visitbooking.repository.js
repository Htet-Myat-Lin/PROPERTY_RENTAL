import { prisma } from "@/lib/prisma";
export class VisitBookingRepository {
    static async create(landlordId, tenantId, propertyId, phoneNumber, schedules) {
        return await prisma.visitBooking.create({
            data: {
                landlordId,
                tenantId,
                propertyId,
                phoneNumber,
                schedules
            }
        });
    }
    static async findByTenantId(tenantId) {
        return await prisma.visitBooking.findMany({
            where: { tenantId },
            include: {
                property: true,
                landlord: {
                    select: { id: true, username: true, email: true, profilePicture: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }
    static async findByLandlordId(landlordId) {
        return await prisma.visitBooking.findMany({
            where: { landlordId },
            include: {
                property: true,
                tenant: {
                    select: { id: true, username: true, email: true, profilePicture: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }
    static async findById(bookingId) {
        return await prisma.visitBooking.findUnique({
            where: { id: bookingId }
        });
    }
    static async updateBooking(bookingId, data) {
        return await prisma.visitBooking.update({
            where: { id: bookingId },
            data,
            include: {
                property: true,
                landlord: {
                    select: { id: true, username: true, email: true, profilePicture: true }
                }
            }
        });
    }
    static async deleteBooking(bookingId) {
        return await prisma.visitBooking.delete({
            where: { id: bookingId }
        });
    }
    static async acceptBooking(bookingId, remarks) {
        return await prisma.visitBooking.update({
            where: { id: bookingId },
            data: {
                status: "ACCEPT",
                ...(remarks !== undefined ? { remarks } : {})
            }
        });
    }
    static async rejectBooking(bookingId, remarks) {
        return await prisma.visitBooking.update({
            where: { id: bookingId },
            data: {
                status: "REJECT",
                ...(remarks !== undefined ? { remarks } : {})
            }
        });
    }
    static async updateRemarks(bookingId, remarks) {
        return await prisma.visitBooking.update({
            where: { id: bookingId },
            data: { remarks }
        });
    }
}
