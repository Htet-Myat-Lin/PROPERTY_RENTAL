import { Box, Flex, Text, VStack, Icon } from "@chakra-ui/react";
import type { Message } from "../types";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";
import { useRef, useEffect } from "react";
import { useAppStore } from "@/app/store";
import { getDateLabel, formatMessageTime, chatScrollbarCss } from "../utils/format";
import { LuMessageCircle } from "react-icons/lu";

interface MessageListProps {
    messages: Message[];
    currentUserId: string;
    isOtherTyping?: boolean;
    otherUserName?: string;
}

export function MessageList({
    messages,
    currentUserId,
    isOtherTyping = false,
    otherUserName,
}: MessageListProps) {
    const messageEndRef = useRef<HTMLDivElement>(null);
    const currentChatId = useAppStore((state) => state.currentChatId);
    const chatList = useAppStore((state) => state.chatList);
    const activeChat = chatList.find((chat) => chat.id === currentChatId);
    const lastReadMessageId = activeChat?.chatReads?.[0]?.lastReadMessageId ?? null;

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOtherTyping]);

    if (messages.length === 0 && !isOtherTyping) {
        return (
            <Flex
                flex="1"
                direction="column"
                align="center"
                justify="center"
                gap="3"
                px="6"
                minH="0"
            >
                <Flex
                    align="center"
                    justify="center"
                    w="14"
                    h="14"
                    borderRadius="xl"
                    bg="bg.muted"
                    color="fg.muted"
                >
                    <Icon as={LuMessageCircle} boxSize="6" />
                </Flex>
                <VStack gap="1">
                    <Text fontSize="sm" fontWeight="medium">
                        No messages yet
                    </Text>
                    <Text fontSize="xs" color="fg.muted" textAlign="center">
                        Say hello to {otherUserName ?? "start"} the conversation.
                    </Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Flex
            direction="column"
            justifyContent="flex-start"
            gap="1"
            flex="1"
            minH="0"
            overflowY="auto"
            overflowX="hidden"
            px={{ base: 3, md: 5 }}
            py="4"
            css={chatScrollbarCss}
        >
            {messages.map((message, index) => {
                const prev = messages[index - 1];
                const next = messages[index + 1];

                const showDateLabel =
                    !prev || getDateLabel(prev.createdAt) !== getDateLabel(message.createdAt);

                const isOwn = message.senderId === currentUserId;
                const isGroupedWithPrev =
                    !!prev &&
                    prev.senderId === message.senderId &&
                    getDateLabel(prev.createdAt) === getDateLabel(message.createdAt) &&
                    new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime() < 120_000;

                const isGroupedWithNext =
                    !!next &&
                    next.senderId === message.senderId &&
                    getDateLabel(next.createdAt) === getDateLabel(message.createdAt) &&
                    new Date(next.createdAt).getTime() - new Date(message.createdAt).getTime() < 120_000;

                return (
                    <Box key={message.id}>
                        {showDateLabel && (
                            <Flex justifyContent="center" my="3">
                                <Box
                                    bg="bg.muted"
                                    px="3"
                                    py="1"
                                    borderRadius="full"
                                    border="1px solid"
                                    borderColor="border.muted"
                                >
                                    <Text fontSize="2xs" color="fg.muted" fontWeight="medium">
                                        {getDateLabel(message.createdAt)}
                                    </Text>
                                </Box>
                            </Flex>
                        )}
                        <MessageItem
                            id={message.id}
                            content={message.content}
                            time={formatMessageTime(message.createdAt)}
                            senderName={message.sender?.username as string}
                            isOwn={isOwn}
                            showReadStatus={
                                isOwn && lastReadMessageId === message.id
                            }
                            showAvatar={!isOwn && !isGroupedWithNext}
                            isFirstInGroup={!isGroupedWithPrev}
                            isLastInGroup={!isGroupedWithNext}
                        />
                    </Box>
                );
            })}

            {isOtherTyping && <TypingIndicator />}
            <div ref={messageEndRef} />
        </Flex>
    );
}
