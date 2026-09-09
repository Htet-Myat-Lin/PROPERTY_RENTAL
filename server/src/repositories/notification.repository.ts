import {prisma} from "@/lib/prisma";

export class NotificationRepository {
    static async createNotification (userId: string, title: string, content: string) {
        return prisma.notification.create({
            data: { userId, title, content }
        })
    }

    static async getAllNotificationsByUserId (userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })
    }

    static async markNotificationAsRead (notificationId: string) {
        return prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        })
    }

    static async deleteNotification (notificationId: string) {
        return prisma.notification.delete({
            where: { id: notificationId }
        })
    }

    static async bulkMarkNotificationsAsRead (ids: string[]) {
        return prisma.notification.updateMany({
            where: { id: { in: ids } },
            data: { isRead: true }
        })
    }

    static async bulkDeleteNotifications (ids: string[]) {
        return prisma.notification.deleteMany({
            where: { id: { in: ids } }
        })
    }
}