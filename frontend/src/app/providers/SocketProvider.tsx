import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Socket } from "socket.io-client";
import { useAppStore } from "../store";
import { SocketContext } from "@/socket/SocketContext";
import { socket } from "@/socket/socket";
import type { Notification } from "@/features/notification/type";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socketConnection, setSocketConnection] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppStore((state) => state.accessToken);
  const setNotifications = useAppStore((state) => state.setNotifications);

  useEffect(() => {
    socket.auth = { token };

    const handleConnect = () => {
      setSocketConnection(socket);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setSocketConnection(null);
      setIsConnected(false);
    };

    const handleConnectError = (err: Error) => {
      console.error("Socket connection error:", err);
      setSocketConnection(null);
      setIsConnected(false);
    };

    // Notification socket event listeners
    const fetchNotifications = (notifications: Notification[]) => {
      setNotifications(notifications);
    }

    const notificationCreated = (notification: Notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    }

    const notificationMarkedRead = (notificationId: string) => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    }

    const notificationsMarkedRead = (notificationIds: string[]) => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notificationIds.includes(notification.id) ? { ...notification, isRead: true } : notification
        )
      );
    }

    const notificationDeleted = (notificationId: string) => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    }
    
    const notificationsDeleted = (notificationIds: string[]) => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => !notificationIds.includes(notification.id))
      );
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    socket.on("notifications_fetched", fetchNotifications);
    socket.on("notification_created", notificationCreated);
    socket.on("notification_marked_read", notificationMarkedRead);
    socket.on("notifications_marked_read", notificationsMarkedRead);
    socket.on("notification_deleted", notificationDeleted);
    socket.on("notifications_deleted", notificationsDeleted);

    if (token) {
      socket.connect();
      socket.emit("notifications_list");
    } else socket.disconnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [token, setNotifications]);

  return (
    <SocketContext.Provider value={{ socket: socketConnection, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
