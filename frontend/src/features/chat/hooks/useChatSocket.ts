import { useAppStore } from "@/app/store";
import { useSocket } from "@/socket/useSocket";
import { useEffect, useCallback, useRef } from "react";
import type { Chat, Message } from "../types";
import { useShallow } from "zustand/react/shallow";

export function useChatSocket() {
  const { socket, isConnected } = useSocket();
  const user = useAppStore(s => s.user);

  const { setMessages, setTypingUserId, setChatList, setUnreadCount, setOnlineUsers, currentChatId } = useAppStore(
    useShallow((state) => ({
      setMessages: state.setMessages,
      setTypingUserId: state.setTypingUserId,
      setChatList: state.setChatList,
      setUnreadCount: state.setUnreadCount,
      setOnlineUsers: state.setOnlineUsers,
      currentChatId: state.currentChatId
    }))
  )

  const chatMessages = useCallback((msgs: Message[]) => {
    setMessages(msgs);
  }, [setMessages]);

  const receiveMessage = useCallback((message: Message) => {
    setMessages((current) => [...current, message]);
  }, [setMessages]);

  const editMessage = useCallback((editedMessage: Message) => {
    setMessages((current) => current.map(m => m.id === editedMessage.id ? editedMessage : m));
  }, [setMessages]);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((current) => current.filter(m => m.id !== messageId));
  }, [setMessages]);

  const typingUser = useCallback(({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
    setTypingUserId(isTyping ? userId : null);
  }, [setTypingUserId]);

  const chatLists = useCallback((chats: Chat[]) => {
    setChatList(chats);
  }, [setChatList]);

  const lastMessage = useCallback(({ chatId, lastMessage }: { chatId: string; lastMessage: string }) => {
    setChatList((current) => current.map(c => c.id === chatId ? { ...c, lastMessage } : c));
  }, [setChatList]);

  const chatRead = useCallback(({ chatId, lastReadMessageId }: { chatId: string; lastReadMessageId: string }) => {
    setUnreadCount(chatId, 0, lastReadMessageId);
  }, [setUnreadCount])

  const unreadCountUpdated = useCallback((payload: { chatId: string, unreadCount: number, chat?: Chat }) => {
    const { chatId, unreadCount, chat } = payload;
    if (chat) {
      setChatList((current) => {
        const exists = current.some(c => c.id === chatId);
        const next = exists
          ? current.map(c => c.id === chatId ? { ...c, ...chat } : c)
          : [chat, ...current];
        return [...next].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
    } else {
      setUnreadCount(chatId, unreadCount);
    }
  }, [setChatList, setUnreadCount])

  const onlineUsers = useCallback((userIds: string[]) => {
    setOnlineUsers(userIds);
  }, [setOnlineUsers])

  // Leave the active chat room when no chat is selected (avoid spamming during render)
  useEffect(() => {
    if (!currentChatId) {
      socket?.emit("leave_chat")
    }
  }, [currentChatId, socket, isConnected])

  // Re-join the open chat after a socket (re)connect so messages keep flowing and
  // the user is not falsely counted as unread while actually viewing the chat.
  const prevConnected = useRef(false);
  useEffect(() => {
    const wasConnected = prevConnected.current;
    prevConnected.current = isConnected;
    if (isConnected && !wasConnected && socket) {
      const chat = useAppStore.getState().chatList.find(c => c.id === currentChatId);
      if (chat) {
        socket.emit("join_chat", {
          landlordId: chat.landlordId,
          tenantId: chat.tenantId,
          propertyId: chat.propertyId
        });
      }
    }
  }, [isConnected, socket, currentChatId])

  // Emit leave_chat on unmount so the server clears presence; incoming messages
  // then increment unread while the user is away instead of being silently marked read.
  useEffect(() => {
    return () => {
      socket?.emit("leave_chat");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("chat_messages", chatMessages);
    socket?.on("receive_message", receiveMessage);
    socket?.on("message_edited", editMessage);
    socket?.on("message_deleted", deleteMessage);
    socket?.on("user_typing", typingUser);
    socket?.on("chat_list_fetched", chatLists);
    socket?.on("last_message_updated", lastMessage);
    socket?.on("chat_read", chatRead);
    socket?.on("unread_count_updated", unreadCountUpdated);
    socket?.on("online_users", onlineUsers);

    if (user && isConnected) {
      socket?.emit("chat_list", user.id)
      socket?.emit("get_online_users")
    }

    return () => {
      socket?.off("chat_messages", chatMessages);
      socket?.off("receive_message", receiveMessage);
      socket?.off("message_edited", editMessage);
      socket?.off("message_deleted", deleteMessage);
      socket?.off("user_typing", typingUser);
      socket?.off("chat_list_fetched", chatLists);
      socket?.off("last_message_updated", lastMessage);
      socket?.off("chat_read", chatRead);
      socket?.off("unread_count_updated", unreadCountUpdated);
      socket?.off("online_users", onlineUsers);
    };
  }, [socket, chatMessages, receiveMessage, editMessage, deleteMessage, typingUser, chatLists, lastMessage, chatRead, unreadCountUpdated, onlineUsers, isConnected, user]);
}
