const activeViewers = new Map<string, Set<string>>();

export const ChatPresence = {
    join: (chatId: string, userId: string) => {
        if (!activeViewers.has(chatId)) activeViewers.set(chatId, new Set())
        activeViewers.get(chatId)?.add(userId)
    },

    leave: (chatId: string, userId: string) => {
        activeViewers.get(chatId)?.delete(userId)
    },

    isViewing: (chatId: string, userId: string) => {
        return activeViewers.get(chatId)?.has(userId)
    }
}