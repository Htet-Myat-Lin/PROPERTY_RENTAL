const onlineUsers = new Set<String>;

export const OnlineUsers = {
    addToOnlineUsers: (userId: string) => onlineUsers.add(userId),
    removeFromOnlineUsers: (userId: string) => onlineUsers.delete(userId),
    list: () => Array.from(onlineUsers)
}