import { prisma } from "@/lib/prisma";
export class ChatReadRepository {
    static async increaseUnreadCount(chatId, userId) {
        return prisma.chatRead.upsert({
            where: { chatId_userId: { chatId, userId } },
            update: { unreadCount: { increment: 1 } },
            create: { chatId, userId, lastReadMessageId: "", unreadCount: 1 }
        });
    }
    static async markRead(chatId, userId, lastReadMessageId) {
        return prisma.chatRead.upsert({
            where: { chatId_userId: { chatId, userId } },
            update: { lastReadMessageId, lastReadAt: new Date(), unreadCount: 0 },
            create: { chatId, userId, lastReadMessageId, lastReadAt: new Date(), unreadCount: 0 }
        });
    }
    static async updateLastReadMessage(messageId, userId, chatId) {
        return prisma.chatRead.update({
            where: { chatId_userId: { chatId, userId } },
            data: { lastReadMessageId: messageId }
        });
    }
}
