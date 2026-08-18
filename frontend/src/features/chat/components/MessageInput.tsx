import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Flex, HStack, Icon, IconButton, Textarea } from "@chakra-ui/react";
import { LuSend, LuSmile } from "react-icons/lu";
import { useSocket } from "@/socket/useSocket";

interface MessageInputProps {
    onSend: (content: string) => void;
    placeholder?: string;
}

export function MessageInput({
    onSend,
    placeholder = "Type a message...",
}: MessageInputProps) {
    const [value, setValue] = useState("");
    const { socket, isConnected } = useSocket();
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);

    const emitTyping = useCallback(
        (isTyping: boolean) => {
            if (!socket || !isConnected) return;
            socket.emit("typing", isTyping);
            isTypingRef.current = isTyping;
        },
        [socket, isConnected]
    );

    const handleChange = (next: string) => {
        setValue(next);

        if (!next.trim()) {
            if (isTypingRef.current) emitTyping(false);
            return;
        }

        if (!isTypingRef.current) emitTyping(true);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => emitTyping(false), 2000);
    };

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setValue("");
        emitTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            if (isTypingRef.current) emitTyping(false);
        };
    }, [emitTyping]);

    return (
        <HStack gap="2" w="full" align="flex-end">
            <Box
                flex="1"
                border="1px solid"
                borderColor="border.muted"
                borderRadius="2xl"
                bg="bg.panel"
                px="1"
                py="1"
                transition="border-color 0.2s, box-shadow 0.2s"
                _focusWithin={{
                    borderColor: "blue.300",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-300)",
                }}
            >
                <Flex align="flex-end" gap="2" px="2" py="1">
                    <Icon as={LuSmile} boxSize="4" color="fg.muted" mb="2" flexShrink={0} />
                    <Textarea
                        value={value}
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={placeholder}
                        variant="flushed"
                        border="none"
                        resize="none"
                        rows={1}
                        minH="10"
                        maxH="32"
                        py="2"
                        px="0"
                        flex="1"
                        fontSize="sm"
                        _focus={{ outline: "none", boxShadow: "none" }}
                        css={{
                            fieldSizing: "content",
                        }}
                    />
                </Flex>
            </Box>

            <IconButton
                variant="solid"
                colorPalette="blue"
                aria-label="Send message"
                title="Send"
                borderRadius="xl"
                size="lg"
                disabled={!value.trim()}
                onClick={handleSend}
                flexShrink={0}
            >
                <LuSend />
            </IconButton>
        </HStack>
    );
}
