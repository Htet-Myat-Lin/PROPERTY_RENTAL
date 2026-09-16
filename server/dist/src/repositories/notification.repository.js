import { prisma } from "@/lib/prisma";
export class NotificationRepository {
    static async createNotification(userId, title, content) {
        return prisma.notification.create({
            data: { userId, title, content }
        });
    }
    static async getAllNotificationsByUserId(userId) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async markNotificationAsRead(notificationId) {
        return prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
    }
    static async deleteNotification(notificationId) {
        return prisma.notification.delete({
            where: { id: notificationId }
        });
    }
    static async bulkMarkNotificationsAsRead(ids) {
        return prisma.notification.updateMany({
            where: { id: { in: ids } },
            data: { isRead: true }
        });
    }
    static async bulkDeleteNotifications(ids) {
        return prisma.notification.deleteMany({
            where: { id: { in: ids } }
        });
    }
}
