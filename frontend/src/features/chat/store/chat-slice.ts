import type { StoreSlice } from "@/app/types";
import type { IChatSlice } from "../types";

export const createChatSlice: StoreSlice<IChatSlice> = (set) => ({
    messages: [],
    typingUserId: null,
    currentChatId: null,
    chatList: [],
    onlineUsers: [],

    setMessages: (messages) => set((state) => ({
        messages: typeof messages === "function" ? messages(state.messages) : messages
    })),
    setTypingUserId: (userId) => set({ typingUserId: userId }),
    setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
    setChatList: (chatList) => set((state) => ({
        chatList: typeof chatList === "function" ? chatList(state.chatList) : chatList
    })),
    setUnreadCount: (chatId, count, lastReadMessageId) =>
        set((state) => ({
            chatList: state.chatList.map((chat) =>
                chat.id === chatId
                    ? {
                        ...chat,
                        chatReads: [
                            {
                                ...(chat.chatReads?.[0] ?? {}),
                                unreadCount: count,
                                ...(lastReadMessageId !== undefined ? { lastReadMessageId } : {}),
                            },
                        ],
                    }
                    : chat
            ),
        })),
    setOnlineUsers: (userIds: string[]) => set({ onlineUsers: userIds })
})