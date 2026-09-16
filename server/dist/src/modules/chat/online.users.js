const onlineUsers = new Set;
export const OnlineUsers = {
    addToOnlineUsers: (userId) => onlineUsers.add(userId),
    removeFromOnlineUsers: (userId) => onlineUsers.delete(userId),
    list: () => Array.from(onlineUsers)
};
