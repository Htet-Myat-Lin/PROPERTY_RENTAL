import { useSocket } from "@/socket/useSocket";
import {
    Avatar,
    Box,
    Flex,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaTrash, FaPen } from "react-icons/fa";
import { LuSmile } from "react-icons/lu";
import { BiSolidEditAlt } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

interface MessageItemProps {
    id: string;
    content: string;
    time: string;
    senderName: string;
    isOwn?: boolean;
    showReadStatus?: boolean;
    showAvatar?: boolean;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
}

export function MessageItem({
    id: messageId,
    content,
    time,
    senderName,
    isOwn = false,
    showReadStatus = false,
    showAvatar = true,
    isFirstInGroup = true,
    isLastInGroup = true,
}: MessageItemProps) {
    const { socket, isConnected } = useSocket();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [message, setMessage] = useState(content ?? "");

    function deleteMessage() {
        if (socket && isConnected) {
            socket.emit("delete_message", messageId);
        }
    }

    function editMessage() {
        if (socket && isConnected) {
            socket.emit("edit_message", { messageId, newContent: message });
        }
    }

    const ownBubbleRadius = {
        borderTopRightRadius: isFirstInGroup ? "2xl" : "lg",
        borderBottomRightRadius: isLastInGroup ? "sm" : "lg",
        borderTopLeftRadius: "2xl",
        borderBottomLeftRadius: "2xl",
    };

    const otherBubbleRadius = {
        borderTopLeftRadius: isFirstInGroup ? "2xl" : "lg",
        borderBottomLeftRadius: isLastInGroup ? "sm" : "lg",
        borderTopRightRadius: "2xl",
        borderBottomRightRadius: "2xl",
    };

    if (isOwn) {
        return (
            <Flex justifyContent="flex-end" w="full" mt={isFirstInGroup ? 2 : 0.5}>
                <Box
                    position="relative"
                    maxW={{ base: "85%", md: "70%" }}
                    w="fit-content"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {!isEditOpen ? (
                        <Box
                            bg="blue.600"
                            color="white"
                            px="4"
                            py="2"
                            shadow="sm"
                            {...ownBubbleRadius}
                        >
                            <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="tall">
                                {content}
                            </Text>
                            {isLastInGroup && (
                                <Flex align="center" justify="flex-end" gap="1" mt="1">
                                    <Text fontSize="2xs" color="whiteAlpha.800">
                                        {time}
                                    </Text>
                                    {showReadStatus && (
                                        <Icon size="sm" color="blue.200">
                                            <IoCheckmarkDoneOutline />
                                        </Icon>
                                    )}
                                </Flex>
                            )}
                        </Box>
                    ) : (
                        <Box
                            bg="bg.panel"
                            border="1px solid"
                            borderColor="blue.300"
                            px="3"
                            py="2"
                            shadow="md"
                            borderRadius="xl"
                            minW="220px"
                        >
                            <InputGroup startElement={<LuSmile color="var(--chakra-colors-fg-muted)" />}>
                                <Input
                                    size="sm"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            editMessage();
                                            setIsEditOpen(false);
                                        }
                                        if (e.key === "Escape") {
                                            setIsEditOpen(false);
                                            setMessage(content);
                                        }
                                    }}
                                    placeholder="Edit message"
                                    variant="subtle"
                                    borderRadius="lg"
                                    autoFocus
                                />
                            </InputGroup>
                            <HStack gap="1" justify="flex-end" mt="2">
                                <IconButton
                                    variant="ghost"
                                    aria-label="Cancel edit"
                                    title="Cancel"
                                    size="xs"
                                    borderRadius="md"
                                    onClick={() => {
                                        setIsEditOpen(false);
                                        setMessage(content);
                                    }}
                                >
                                    <IoMdClose />
                                </IconButton>
                                <IconButton
                                    variant="solid"
                                    colorPalette="blue"
                                    aria-label="Save edit"
                                    title="Save"
                                    size="xs"
                                    borderRadius="md"
                                    disabled={!message.trim() || message.trim() === content.trim()}
                                    onClick={() => {
                                        editMessage();
                                        setIsEditOpen(false);
                                    }}
                                >
                                    <BiSolidEditAlt />
                                </IconButton>
                            </HStack>
                        </Box>
                    )}

                    {!isEditOpen && (
                        <HStack
                            position="absolute"
                            bottom="100%"
                            right="0"
                            mb="-6px"
                            pb="6px"
                            bg="bg.panel"
                            border="1px solid"
                            borderColor="border.muted"
                            boxShadow="md"
                            px="1"
                            py="0.5"
                            borderRadius="lg"
                            gap="0.5"
                            opacity={isHovered ? 1 : 0}
                            pointerEvents={isHovered ? "auto" : "none"}
                            transform={isHovered ? "translateY(0)" : "translateY(4px)"}
                            transition="opacity 0.15s ease, transform 0.15s ease"
                            zIndex={1}
                        >
                            <IconButton
                                aria-label="Edit message"
                                size="xs"
                                variant="ghost"
                                color="fg.muted"
                                borderRadius="md"
                                _hover={{ color: "blue.600", bg: "blue.50" }}
                                onClick={() => setIsEditOpen(true)}
                            >
                                <FaPen />
                            </IconButton>
                            <IconButton
                                aria-label="Delete message"
                                size="xs"
                                variant="ghost"
                                color="fg.muted"
                                borderRadius="md"
                                _hover={{ color: "red.600", bg: "red.50" }}
                                onClick={deleteMessage}
                            >
                                <FaTrash />
                            </IconButton>
                        </HStack>
                    )}
                </Box>
            </Flex>
        );
    }

    return (
        <Flex alignItems="flex-end" gap="2" mt={isFirstInGroup ? 2 : 0.5}>
            {showAvatar ? (
                <Avatar.Root size="sm" flexShrink="0">
                    <Avatar.Fallback name={senderName} />
                </Avatar.Root>
            ) : (
                <Box w="8" flexShrink="0" />
            )}

            <Box
                maxW={{ base: "85%", md: "70%" }}
                bg="bg.muted"
                px="4"
                py="2"
                border="1px solid"
                borderColor="border.muted"
                {...otherBubbleRadius}
            >
                {isFirstInGroup && (
                    <Text fontSize="2xs" fontWeight="semibold" color="blue.600" mb="0.5">
                        {senderName}
                    </Text>
                )}
                <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="tall">
                    {content}
                </Text>
                {isLastInGroup && (
                    <Text fontSize="2xs" color="fg.muted" textAlign="end" mt="1">
                        {time}
                    </Text>
                )}
            </Box>
        </Flex>
    );
}
