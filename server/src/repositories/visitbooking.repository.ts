import { prisma } from "@/lib/prisma";

export class VisitBookingRepository {
    static async create(
        landlordId: string, 
        tenantId: string, 
        propertyId: string, 
        phoneNumber: string, 
        schedules: Record<"date" | "time", string>[]
    ) {
        return await prisma.visitBooking.create({
            data: {
                landlordId,
                tenantId,
                propertyId,
                phoneNumber,
                schedules
            }
        })
    }

    static async findByTenantId(tenantId: string) {
        return await prisma.visitBooking.findMany({
            where: { tenantId }
        })
    }

    static async findByLandlordId(landlordId: string) {
        return await prisma.visitBooking.findMany({
            where: { landlordId }
        })
    }

    static async acceptBooking(bookingId: string) {
        return await prisma.visitBooking.update({
            where: { id: bookingId },
            data: { accepted: true }
        })
    }

    static async rejectBooking(bookingId: string) {
        return await prisma.visitBooking.update({
            where: { id: bookingId },
            data: { accepted: false }
        })
    }

    static async updateRemarks(bookingId: string, remarks: string) {
        return await prisma.visitBooking.update({
            where: { id: bookingId },
            data: { remarks }
        })
    }
}