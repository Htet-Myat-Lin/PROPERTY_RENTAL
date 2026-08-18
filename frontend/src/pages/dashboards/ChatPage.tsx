import { ChatPanel } from "@/features/chat/components/ChatPanel";
import { SideBar } from "@/features/chat/components/SideBar";
import { useChatSocket } from "@/features/chat/hooks/useChatSocket";
import { useAppStore } from "@/app/store";
import { Flex, Box, Separator } from "@chakra-ui/react";

export function ChatPage() {
    useChatSocket();

    const currentChatId = useAppStore((s) => s.currentChatId);
    const hasActiveChat = !!currentChatId;

    return (
        <Flex
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border.muted"
            w="full"
            shadow="lg"
            h={{ base: "calc(100vh - 140px)", md: "calc(100vh - 160px)" }}
            maxH={{ base: "calc(100vh - 140px)", md: "calc(100vh - 160px)" }}
            minH="480px"
            overflow="hidden"
        >
            <Box
                w={{ base: "full", md: "320px" }}
                minW={{ base: "full", md: "280px" }}
                maxW={{ base: "none", md: "380px" }}
                h="full"
                minH="0"
                flexShrink={0}
                display={{ base: hasActiveChat ? "none" : "block", md: "block" }}
            >
                <SideBar />
            </Box>

            <Separator
                orientation="vertical"
                borderColor="border.muted"
                display={{ base: "none", md: "block" }}
            />

            <Box
                flex="1"
                minW="0"
                h="full"
                minH="0"
                bg="bg.subtle/30"
                display={{ base: hasActiveChat ? "flex" : "none", md: "flex" }}
            >
                <ChatPanel />
            </Box>
        </Flex>
    );
}
