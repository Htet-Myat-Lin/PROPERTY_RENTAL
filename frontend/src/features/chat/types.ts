export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    sender?: {
        id: string;
        username: string;
        profileImage?: string;
    }
}

interface ChatRead {
    unreadCount: number,
    lastReadMessageId?: string;
}

export interface Chat {
    id: string;
    landlordId: string;
    tenantId: string;
    propertyId: string;
    lastMessage?: string;
    createdAt: Date;
    updatedAt: Date;
    landlord?: {
        id: string;
        username: string;
        profileImage?: string;
    };
    tenant?: {
        id: string;
        username: string;
        profileImage?: string;
    };
    property?: {
        id: string;
        title: string;
        images?: string[];
    };
    chatReads?: ChatRead[]
}

export interface UnreadCountUpdatedPayload {
    chatId: string;
    unreadCount: number;
    chat?: Chat;
}

export interface IChatSlice {
    messages: Message[];
    typingUserId: string | null;
    currentChatId: string | null;
    chatList: Chat[];
    onlineUsers: string[];

    setMessages: (messages: Message[] | ((current: Message[]) => Message[])) => void;
    setTypingUserId: (userId: string | null) => void;
    setCurrentChatId: (chatId: string | null) => void;
    setChatList: (chatList: Chat[] | ((current: Chat[]) => Chat[])) => void;
    setUnreadCount: (chatId: string, count: number, lastReadMessageId?: string) => void;
    setOnlineUsers: (userIds: string[]) => void;
}

