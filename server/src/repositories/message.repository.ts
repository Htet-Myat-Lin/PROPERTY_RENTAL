import { prisma } from "@/lib/prisma"

export class MessageRepository {
    static async getChatMessages (chatId: string) {
        return prisma.message.findMany({
            where: {chatId},
            include: {sender: {select: {id: true, username: true, profilePicture: true}}},
            orderBy: {createdAt: 'asc'}
        });
    }

    static async createMessage (chatId: string, senderId: string, content: string) {
        return prisma.message.create({
            data: {chatId, senderId, content}
        });
    }

    static async editMessage (messageId: string, newContent: string) {
        return prisma.message.update({
            where: {id: messageId},
            data: {content: newContent}
        });
    }

    static async deleteMessage (messageId: string) {
        return prisma.message.delete({
            where: {id: messageId}
        });
    }

    static async getLastMessage(chatId: string) {
        return prisma.message.findMany({
            where: {chatId},
            orderBy: {createdAt: 'desc'},
            take: 2
        });
    }
}