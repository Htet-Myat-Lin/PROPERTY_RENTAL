import { prisma } from "@/lib/prisma";
export class ChatRepository {
    static async findOrCreateChat(landlordId, tenantId, propertyId) {
        return await prisma.chat.upsert({
            where: { landlordId_tenantId_propertyId: { landlordId, tenantId, propertyId } },
            update: {},
            create: { landlordId, tenantId, propertyId }
        });
    }
    static async getChatsByUser(userId) {
        return await prisma.chat.findMany({
            where: { OR: [{ landlordId: userId }, { tenantId: userId }], lastMessage: { not: null } },
            include: {
                landlord: { select: { id: true, username: true, profilePicture: true } },
                tenant: { select: { id: true, username: true, profilePicture: true } },
                property: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async updateLastMessage(chatId, lastMessage) {
        return await prisma.chat.update({
            where: { id: chatId },
            data: { lastMessage }
        });
    }
}
