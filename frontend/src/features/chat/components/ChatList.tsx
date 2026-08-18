import { useMemo, useState } from "react";
import {
    Badge,
    Flex,
    For,
    Icon,
    IconButton,
    Input,
    InputGroup,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuMessageSquarePlus, LuSearch } from "react-icons/lu";
import { ChatItem } from "./ChatItem";
import { useAppStore } from "@/app/store";
import { useSocket } from "@/socket/useSocket";
import type { Chat } from "../types";
import { chatScrollbarCss } from "../utils/format";

export function ChatList() {
    const [query, setQuery] = useState("");

    const { socket, isConnected } = useSocket();
    const chatList = useAppStore((s) => s.chatList);
    const currentChatId = useAppStore((s) => s.currentChatId);
    const setCurrentChatId = useAppStore((s) => s.setCurrentChatId);

    const filteredChats = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return chatList;

        return chatList.filter((chat) => {
            const otherName =
                chat.landlord?.username?.toLowerCase() ??
                chat.tenant?.username?.toLowerCase() ??
                "";
            const propertyTitle = chat.property?.title?.toLowerCase() ?? "";
            const lastMsg = chat.lastMessage?.toLowerCase() ?? "";
            return otherName.includes(q) || propertyTitle.includes(q) || lastMsg.includes(q);
        });
    }, [chatList, query]);

    const totalUnread = useMemo(
        () => chatList.reduce((sum, chat) => sum + (chat.chatReads?.[0]?.unreadCount ?? 0), 0),
        [chatList]
    );

    function handleChatItemClick(chat: Chat) {
        setCurrentChatId(chat.id);
        if (isConnected && chat && socket) {
            socket.emit("join_chat", {
                landlordId: chat.landlordId,
                tenantId: chat.tenantId,
                propertyId: chat.propertyId,
            });
        }
    }

    return (
        <Flex direction="column" height="100%" minH="0">
            <Flex
                alignItems="center"
                justifyContent="space-between"
                px="4"
                pt="4"
                pb="3"
                flexShrink={0}
            >
                <Flex align="center" gap="2">
                    <Text fontSize="lg" fontWeight="bold">
                        Messages
                    </Text>
                    {totalUnread > 0 && (
                        <Badge
                            size="sm"
                            colorPalette="blue"
                            variant="solid"
                            borderRadius="full"
                            px="2"
                        >
                            {totalUnread > 99 ? "99+" : totalUnread}
                        </Badge>
                    )}
                </Flex>
                <IconButton
                    variant="ghost"
                    aria-label="New chat"
                    title="Start a chat from a property listing"
                    size="sm"
                    borderRadius="lg"
                    color="fg.muted"
                    _hover={{ color: "blue.600", bg: "blue.50" }}
                >
                    <LuMessageSquarePlus />
                </IconButton>
            </Flex>

            <VStack gap="3" px="4" pb="3" flexShrink={0}>
                <InputGroup flex="1" startElement={<LuSearch color="var(--chakra-colors-fg-muted)" />}>
                    <Input
                        placeholder="Search conversations..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        size="sm"
                        variant="subtle"
                        borderRadius="xl"
                        bg="bg.subtle"
                        _focusVisible={{ bg: "bg.panel", borderColor: "blue.300" }}
                    />
                </InputGroup>
            </VStack>

            <Flex
                direction="column"
                gap="0.5"
                px="2"
                pb="2"
                flex="1"
                minH="0"
                overflowY="auto"
                overflowX="hidden"
                css={chatScrollbarCss}
            >
                {filteredChats.length > 0 ? (
                    <For each={filteredChats}>
                        {(chat) => (
                            <ChatItem
                                chat={chat}
                                handleChatItemClick={handleChatItemClick}
                                key={chat.id}
                                active={chat.id === currentChatId}
                            />
                        )}
                    </For>
                ) : chatList.length > 0 ? (
                    <Flex flex="1" alignItems="center" justifyContent="center" py="8" px="4">
                        <Text fontSize="sm" color="fg.muted" textAlign="center">
                            No conversations match &ldquo;{query}&rdquo;
                        </Text>
                    </Flex>
                ) : (
                    <Flex
                        flex="1"
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        gap="3"
                        py="10"
                        px="4"
                    >
                        <Flex
                            align="center"
                            justify="center"
                            w="12"
                            h="12"
                            borderRadius="xl"
                            bg="bg.subtle"
                            color="fg.muted"
                        >
                            <Icon as={LuMessageSquarePlus} boxSize="5" />
                        </Flex>
                        <Text fontSize="sm" color="fg.muted" textAlign="center" lineHeight="tall">
                            No conversations yet. Message a landlord from a property page to get started.
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}
