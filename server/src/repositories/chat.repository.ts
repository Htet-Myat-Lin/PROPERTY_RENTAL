import {prisma} from "@/lib/prisma";

export const chatInclude = {
    landlord: {select: {id: true, username: true, profilePicture: true}},
    tenant: {select: {id: true, username: true, profilePicture: true}},
    property: {select: {id: true, title: true}},
};

export class ChatRepository {
    static async findOrCreateChat (landlordId: string, tenantId: string, propertyId: string) {
        return prisma.chat.upsert({
            where: {landlordId_tenantId_propertyId: {landlordId, tenantId, propertyId}},
            update: {},
            create: {landlordId, tenantId, propertyId}
        });
    }

    static async getChatsByUser (userId: string) {
        return prisma.chat.findMany({
            where: {OR: [{landlordId: userId}, {tenantId: userId}], lastMessage: {not: null}},
            include: {
                ...chatInclude,
                chatReads: {
                    where: { userId }, select: { unreadCount: true, lastReadMessageId: true }
                }
            },
            orderBy: {updatedAt: 'desc'}
        });
    }

    static async getByIdForUser (chatId: string, userId: string) {
        return prisma.chat.findUnique({
            where: {id: chatId},
            include: {
                ...chatInclude,
                chatReads: {
                    where: { userId }, select: { unreadCount: true, lastReadMessageId: true }
                }
            }
        });
    }

    static async getById (id: string) {
        return prisma.chat.findUnique({ where: { id } });
    }

    static async updateLastMessage (chatId: string, lastMessage: string) {
        return prisma.chat.update({
            where: {id: chatId},
            data: {lastMessage}
        });
    }
}
