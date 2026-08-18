import { ChatRepository } from "@/repositories/chat.repository";
import { MessageRepository } from "@/repositories/message.repository";
export const registerChatSocketHandler = (io, socket) => {
    const id = socket.data.userId;
    /**
     * Join a chat room. If the chat does not exit, create a new chat room and join it.
     * Then, fetch the chat messages
     */
    socket.on("join_chat", async ({ landlordId, tenantId, propertyId }, callback) => {
        const chat = await ChatRepository.findOrCreateChat(landlordId, tenantId, propertyId);
        socket.join(chat.id);
        socket.data.chatId = chat.id;
        console.log(`User ${id} joined chat ${chat.id}`);
        const messages = await MessageRepository.getChatMessages(chat.id);
        socket.emit("chat_messages", messages);
        callback?.({ chatId: chat.id });
        socket.to(chat.id).emit("user_joined", id);
    });
    /**
     * Send a message to the chat room
     */
    socket.on("send_message", async (content) => {
        const chatId = socket.data.chatId;
        const safeContent = content.trim();
        if (!chatId || !safeContent)
            return;
        const message = await MessageRepository.createMessage(chatId, id, safeContent);
        const chat = await ChatRepository.updateLastMessage(chatId, safeContent);
        io.to(chatId).emit("receive_message", message);
        io.to(chatId).emit("last_message_updated", { chatId, lastMessage: chat.lastMessage });
    });
    /**
     * Edit a message in the chat room
     */
    socket.on("edit_message", async ({ messageId, newContent }) => {
        const message = await MessageRepository.editMessage(messageId, newContent);
        io.to(socket.data.chatId).emit("message_edited", message);
    });
    /**
     * Delete a message in the chat room
     */
    socket.on("delete_message", async (messageId) => {
        await MessageRepository.deleteMessage(messageId);
        io.to(socket.data.chatId).emit("message_deleted", messageId);
    });
    /**
     * Notify other user in the chat room that the user is typing
     */
    socket.on("typing", (isTyping) => {
        socket.to(socket.data.chatId).emit("user_typing", { userId: id, isTyping });
    });
    /**
     * Fetch the list of chats for the user
     */
    socket.on("chat_list", async (userId) => {
        const chats = await ChatRepository.getChatsByUser(userId);
        socket.emit("chat_list_fetched", chats);
    });
    /**
     * Update the last message of the chat. This is used to display the last message in the chat list.
     */
    socket.on("last_message", async ({ chatId, lastMessage }) => {
        const chat = await ChatRepository.updateLastMessage(chatId, lastMessage);
        io.to(chatId).emit("last_message_updated", { chatId, lastMessage: chat.lastMessage });
    });
};
