import { useCallback } from "react";
import { useSocket } from "@/socket/useSocket";

export function useNotificationActions() {
    const { socket, isConnected } = useSocket();

    const emit = useCallback(
        (event: string, payload?: unknown) => {
            if (socket && isConnected) socket.emit(event, payload);
        },
        [socket, isConnected]
    );

    const markAsRead = useCallback(
        (notificationId: string) => emit("mark_notification_read", notificationId),
        [emit]
    );

    const markManyAsRead = useCallback(
        (notificationIds: string[]) => {
            if (notificationIds.length > 0) emit("mark_notifications_read", notificationIds);
        },
        [emit]
    );

    const deleteNotification = useCallback(
        (notificationId: string) => emit("delete_notification", notificationId),
        [emit]
    );

    const deleteMany = useCallback(
        (notificationIds: string[]) => {
            if (notificationIds.length > 0) emit("bulk_delete_notifications", notificationIds);
        },
        [emit]
    );

    return { markAsRead, markManyAsRead, deleteNotification, deleteMany };
}