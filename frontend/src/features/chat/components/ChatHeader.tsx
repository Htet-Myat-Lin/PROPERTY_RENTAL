import {
    Avatar,
    Box,
    Flex,
    HStack,
    Icon,
    IconButton,
    Text,
} from "@chakra-ui/react";
import { LuArrowLeft, LuEllipsisVertical, LuHouse, LuPhone, LuVideo } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useAppStore } from "@/app/store";
import type { Chat } from "../types";

interface ChatHeaderProps {
    chat: Chat;
    otherUserName: string;
    otherUserId: string;
    isOnline: boolean;
    isTyping?: boolean;
}

export function ChatHeader({
    chat,
    otherUserName,
    isOnline,
    isTyping = false,
}: ChatHeaderProps) {
    const propertyTitle = chat.property?.title;
    const setCurrentChatId = useAppStore((s) => s.setCurrentChatId);

    return (
        <Flex
            alignItems="center"
            justifyContent="space-between"
            px={{ base: 3, md: 5 }}
            py={3}
            gap="3"
            flexShrink={0}
            bg="bg.panel/80"
            backdropFilter="blur(12px)"
        >
            <HStack gap="2" minW="0">
                <IconButton
                    variant="ghost"
                    aria-label="Back to conversations"
                    title="Back to conversations"
                    size="sm"
                    borderRadius="lg"
                    flexShrink={0}
                    display={{ base: "inline-flex", md: "none" }}
                    onClick={() => setCurrentChatId(null)}
                >
                    <LuArrowLeft />
                </IconButton>

                <HStack gap="3" minW="0">
                <Box position="relative" flexShrink="0">
                    <Avatar.Root size="md">
                        <Avatar.Fallback name={otherUserName} />
                    </Avatar.Root>
                    <Box
                        position="absolute"
                        bottom="0"
                        right="0"
                        boxSize="3"
                        bg={isOnline ? "green.500" : "gray.400"}
                        borderWidth="2px"
                        borderColor="bg.panel"
                        borderRadius="full"
                        aria-label={isOnline ? "Online" : "Offline"}
                    />
                </Box>

                <Box minW="0">
                    <Text fontWeight="semibold" fontSize="md" truncate>
                        {otherUserName}
                    </Text>
                    {propertyTitle && (
                        <HStack gap="1" minW="0">
                            <Icon as={LuHouse} boxSize="3" color="fg.muted" flexShrink={0} />
                            <Text
                                asChild
                                fontSize="xs"
                                color="blue.600"
                                truncate
                                _hover={{ textDecoration: "underline" }}
                            >
                                <Link to={`/properties/${chat.propertyId}`}>
                                    {propertyTitle}
                                </Link>
                            </Text>
                        </HStack>
                    )}
                    <Text fontSize="xs" color={isTyping ? "blue.500" : "fg.muted"}>
                        {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
                    </Text>
                </Box>
                </HStack>
            </HStack>

            <HStack gap="1" flexShrink="0">
                <IconButton variant="ghost" aria-label="Call" title="Call" size="sm" borderRadius="lg">
                    <LuPhone />
                </IconButton>
                <IconButton variant="ghost" aria-label="Video call" title="Video call" size="sm" borderRadius="lg">
                    <LuVideo />
                </IconButton>
                <IconButton variant="ghost" aria-label="More options" title="More options" size="sm" borderRadius="lg">
                    <LuEllipsisVertical />
                </IconButton>
            </HStack>
        </Flex>
    );
}
