import { Box, Flex, Separator } from "@chakra-ui/react";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { EmptyChatPanel } from "./EmptyChatPanel";
import { useAppStore } from "@/app/store";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useSocket } from "@/socket/useSocket";

export function ChatPanel() {
    const { socket, isConnected } = useSocket();
    const messages = useAppStore((s) => s.messages);
    const chatList = useAppStore((s) => s.chatList);
    const user = useAppStore((s) => s.user);
    const currentChatId = useAppStore((s) => s.currentChatId);
    const typingUserId = useAppStore((s) => s.typingUserId);
    const navigate = useNavigate();

    const currentChat = chatList?.find((chat) => chat.id === currentChatId);
    const otherUser =
        currentChat?.landlordId === user?.id
            ? currentChat?.tenant?.username
            : currentChat?.landlord?.username;
    const otherUserId =
        currentChat?.landlordId === user?.id
            ? currentChat?.tenantId
            : currentChat?.landlordId;
    const onlineUsers = useAppStore((s) => s.onlineUsers);
    const isOnline = !!otherUserId && onlineUsers.includes(otherUserId);
    const isOtherTyping = !!otherUserId && typingUserId === otherUserId;

    const handleSendMessage = (content: string) => {
        if (!user) {
            toast.warn("You need to be logged in to send a message.");
            navigate("/login-register");
            return;
        }

        if (!socket || !isConnected) {
            socket?.connect();
            toast.info("Connecting to chat... please click again in a moment.");
            return;
        }

        if (!content.trim()) {
            toast.warn("Message cannot be empty.");
            return;
        }

        socket.emit("send_message", content.trim());
    };

    if (!user) navigate("/login-register");

    if (!currentChatId || !currentChat || !otherUser || !otherUserId) {
        return <EmptyChatPanel />;
    }

    return (
        <Flex direction="column" h="full" w="full" minH="0">
            <ChatHeader
                chat={currentChat}
                otherUserName={otherUser}
                otherUserId={otherUserId}
                isOnline={isOnline}
                isTyping={isOtherTyping}
            />

            <Separator borderColor="border.muted" />

            <MessageList
                messages={messages}
                currentUserId={user!.id}
                isOtherTyping={isOtherTyping}
                otherUserName={otherUser}
            />

            <Separator borderColor="border.muted" />

            <Box
                px={{ base: 3, md: 5 }}
                py={3}
                flexShrink={0}
                bg="bg.panel/80"
                backdropFilter="blur(12px)"
            >
                <MessageInput onSend={handleSendMessage} />
            </Box>
        </Flex>
    );
}
