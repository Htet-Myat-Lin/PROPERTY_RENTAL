const activeViewers = new Map();
export const ChatPresence = {
    join: (chatId, userId) => {
        if (!activeViewers.has(chatId))
            activeViewers.set(chatId, new Set());
        activeViewers.get(chatId)?.add(userId);
    },
    leave: (chatId, userId) => {
        activeViewers.get(chatId)?.delete(userId);
    },
    isViewing: (chatId, userId) => {
        return activeViewers.get(chatId)?.has(userId);
    }
};
