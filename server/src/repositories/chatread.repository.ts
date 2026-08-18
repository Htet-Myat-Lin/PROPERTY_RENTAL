import { prisma } from "@/lib/prisma";

export class ChatReadRepository {
    static async increaseUnreadCount (chatId: string, userId: string) {
        return prisma.chatRead.upsert({
            where: { chatId_userId: { chatId, userId } },
            update: { unreadCount: { increment: 1 } },
            create: { chatId, userId, lastReadMessageId: "", unreadCount: 1 }
        });
    }

    static async markRead(chatId: string, userId: string, lastReadMessageId: string) {
        return prisma.chatRead.upsert({
            where: { chatId_userId: { chatId, userId } },
            update: { lastReadMessageId, lastReadAt: new Date(), unreadCount: 0 },
            create: { chatId, userId, lastReadMessageId, lastReadAt: new Date(), unreadCount: 0 }
        })
    }

    static async updateLastReadMessage(messageId: string, userId: string, chatId: string) {
        return prisma.chatRead.update({
            where: { chatId_userId: { chatId, userId } },
            data: { lastReadMessageId: messageId }
        })
    }
}