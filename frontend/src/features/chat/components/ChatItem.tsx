import { Avatar, Badge, Box, Flex, Icon, Text } from "@chakra-ui/react";
import type { Chat } from "../types";
import { useAppStore } from "@/app/store";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { formatChatTimestamp } from "../utils/format";

interface ChatItemProps {
    chat: Chat;
    active?: boolean;
    handleChatItemClick: (chat: Chat) => void;
}

export function ChatItem({
    chat,
    active = false,
    handleChatItemClick,
}: ChatItemProps) {
    const user = useAppStore((s) => s.user);
    const onlineUsers = useAppStore((s) => s.onlineUsers);
    const otherUserId = chat.landlordId === user?.id ? chat.tenantId : chat.landlordId;
    const isOnline = onlineUsers.includes(otherUserId);
    const unreadCount = chat.chatReads?.[0]?.unreadCount ?? 0;
    const isUnread = unreadCount > 0;
    const hasReadIndicator =
        !!chat.lastMessage &&
        !isUnread &&
        chat.chatReads?.[0]?.lastReadMessageId !== undefined;

    const getSenderPrefix = (lastMessage: string) => {
        const senderId = lastMessage.split(":")[0];
        if (!lastMessage) return null;
        if (senderId === user?.id) return "You:";
        const prefix =
            chat.landlordId === user?.id ? chat.tenant?.username : chat.landlord?.username;
        return `${prefix}:`;
    };

    const getSenderName = () =>
        chat.landlordId === user?.id ? chat.tenant?.username : chat.landlord?.username;

    const lastMessagePreview = chat.lastMessage
        ? `${getSenderPrefix(chat.lastMessage) ?? ""} ${chat.lastMessage.split(":").slice(1).join(":")}`.trim()
        : "No messages yet";

    return (
        <Box
            as="button"
            width="full"
            textAlign="start"
            borderRadius="xl"
            p="3"
            cursor="pointer"
            position="relative"
            transition="background 0.15s ease, transform 0.1s ease"
            _active={{ transform: "scale(0.99)" }}
            bg={active ? "blue.50" : "transparent"}
            _dark={{ bg: active ? "blue.950" : "transparent" }}
            _hover={{ bg: active ? "blue.50" : "bg.subtle" }}
            aria-current={active ? "true" : undefined}
            onClick={() => handleChatItemClick(chat)}
        >
            {active && (
                <Box
                    position="absolute"
                    left="0"
                    top="50%"
                    transform="translateY(-50%)"
                    w="3px"
                    h="60%"
                    bg="blue.500"
                    borderRadius="full"
                />
            )}

            <Flex alignItems="center" gap="3">
                <Box position="relative" flexShrink="0">
                    <Avatar.Root size="md">
                        <Avatar.Fallback name={getSenderName()} />
                    </Avatar.Root>
                    <Box
                        position="absolute"
                        bottom="0"
                        right="0"
                        boxSize="2.5"
                        bg={isOnline ? "green.500" : "gray.400"}
                        borderWidth="2px"
                        borderColor={active ? "blue.50" : "bg.panel"}
                        borderRadius="full"
                        _dark={{ borderColor: active ? "blue.950" : "bg.panel" }}
                    />
                </Box>

                <Flex flex="1" minWidth="0" direction="column" gap="0.5">
                    <Flex alignItems="center" justifyContent="space-between" gap="2">
                        <Text
                            fontSize="sm"
                            fontWeight={isUnread ? "bold" : "semibold"}
                            color={isUnread ? "fg" : active ? "blue.700" : "fg"}
                            truncate
                            _dark={{ color: isUnread ? "fg" : active ? "blue.200" : "fg" }}
                        >
                            {getSenderName()}
                        </Text>
                        <Text fontSize="2xs" color="fg.muted" flexShrink="0">
                            {formatChatTimestamp(chat.updatedAt)}
                        </Text>
                    </Flex>

                    {chat.property?.title && (
                        <Text fontSize="2xs" color="blue.600" truncate _dark={{ color: "blue.300" }}>
                            {chat.property.title}
                        </Text>
                    )}

                    <Flex alignItems="center" justifyContent="space-between" gap="2">
                        <Text
                            fontSize="xs"
                            color={isUnread ? "fg" : "fg.muted"}
                            fontWeight={isUnread ? "medium" : "normal"}
                            truncate
                        >
                            {lastMessagePreview}
                        </Text>

                        {isUnread ? (
                            <Badge
                                size="xs"
                                colorPalette="blue"
                                variant="solid"
                                borderRadius="full"
                                minW="5"
                                h="5"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink="0"
                            >
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </Badge>
                        ) : hasReadIndicator ? (
                            <Icon size="sm" color="blue.500" flexShrink="0">
                                <IoCheckmarkDoneOutline />
                            </Icon>
                        ) : null}
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
}
