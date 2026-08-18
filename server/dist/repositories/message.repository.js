import { prisma } from "@/lib/prisma";
export class MessageRepository {
    static async getChatMessages(chatId) {
        return await prisma.message.findMany({
            where: { chatId },
            include: { sender: { select: { id: true, username: true, profilePicture: true } } },
            orderBy: { createdAt: 'asc' }
        });
    }
    static async createMessage(chatId, senderId, content) {
        return await prisma.message.create({
            data: { chatId, senderId, content }
        });
    }
    static async editMessage(messageId, newContent) {
        return await prisma.message.update({
            where: { id: messageId },
            data: { content: newContent }
        });
    }
    static async deleteMessage(messageId) {
        return await prisma.message.delete({
            where: { id: messageId }
        });
    }
}
