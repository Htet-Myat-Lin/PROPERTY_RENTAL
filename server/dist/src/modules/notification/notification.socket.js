import { NotificationRepository } from "@/repositories/notification.repository";
export const registerNotificationSocketHandler = (io, socket) => {
    const { userId } = socket.data;
    socket.on("notifications_list", async () => {
        const notifications = await NotificationRepository.getAllNotificationsByUserId(userId);
        socket.emit("notifications_fetched", notifications);
    });
    socket.on("mark_notification_read", async (notificationId) => {
        await NotificationRepository.markNotificationAsRead(notificationId);
        socket.emit("notification_marked_read", notificationId);
    });
    socket.on("mark_notifications_read", async (notificationIds) => {
        await NotificationRepository.bulkMarkNotificationsAsRead(notificationIds);
        socket.emit("notifications_marked_read", notificationIds);
    });
    socket.on("delete_notification", async (notificationId) => {
        await NotificationRepository.deleteNotification(notificationId);
        socket.emit("notification_deleted", notificationId);
    });
    socket.on("bulk_delete_notifications", async (notificationIds) => {
        await NotificationRepository.bulkDeleteNotifications(notificationIds);
        socket.emit("notifications_deleted", notificationIds);
    });
};
