export interface Notification {
    id: string;
    title: string;
    content: string;
    isRead: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface INotificationSlice {
    notifications: Notification[];
    setNotifications: (notifications: Notification[] | ((current: Notification[]) => Notification[])) => void;
}