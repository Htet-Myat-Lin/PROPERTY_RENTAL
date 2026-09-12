import { Box, Checkbox, Flex, Icon, IconButton, Text } from "@chakra-ui/react";
import { LuBell, LuCheck, LuTrash2 } from "react-icons/lu";
import type { Notification } from "../type";
import { formatNotificationDate } from "../utils/format";

interface NotificationItemProps {
    notification: Notification;
    selectionMode?: boolean;
    selected?: boolean;
    onToggleSelect?: (id: string) => void;
    onMarkAsRead?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function NotificationItem({
    notification,
    selectionMode = false,
    selected = false,
    onToggleSelect,
    onMarkAsRead,
    onDelete,
}: NotificationItemProps) {
    const isUnread = !notification.isRead;

    return (
        <Box
            as="article"
            data-group
            width="full"
            borderRadius="xl"
            p="3"
            position="relative"
            transition="background 0.15s ease"
            bg={selected ? "blue.50/80" : isUnread ? "blue.50/70" : "bg.subtle"}
            _dark={{
                bg: selected ? "blue.950/70" : isUnread ? "blue.950/50" : "whiteAlpha.50",
            }}
            _hover={{
                bg: selected ? "blue.50" : isUnread ? "blue.50" : "bg.muted",
                _dark: {
                    bg: selected ? "blue.950/80" : isUnread ? "blue.950/70" : "whiteAlpha.100",
                },
            }}
        >
            {isUnread && !selectionMode && (
                <Box
                    position="absolute"
                    left="0"
                    top="50%"
                    transform="translateY(-50%)"
                    w="3px"
                    h="55%"
                    bg="blue.500"
                    borderRadius="full"
                />
            )}

            <Flex alignItems="flex-start" gap="3">
                {selectionMode ? (
                    <Checkbox.Root
                        checked={selected}
                        onChange={() => onToggleSelect?.(notification.id)}
                        mt="1"
                        aria-label={`Select ${notification.title}`}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control
                            borderRadius="md"
                            _checked={{ bg: "blue.500", borderColor: "blue.500" }}
                        />
                    </Checkbox.Root>
                ) : (
                    <Flex
                        align="center"
                        justify="center"
                        w="9"
                        h="9"
                        borderRadius="lg"
                        flexShrink={0}
                        bg={isUnread ? "blue.500" : "bg.subtle"}
                        color={isUnread ? "white" : "fg.muted"}
                        mt="0.5"
                    >
                        <Icon as={LuBell} boxSize="4.5" />
                    </Flex>
                )}

                <Flex flex="1" minWidth="0" direction="column" gap="1">
                    <Flex alignItems="center" justifyContent="space-between" gap="2">
                        <Text
                            fontSize="sm"
                            fontWeight={isUnread && !selectionMode ? "bold" : "semibold"}
                            truncate
                        >
                            {notification.title}
                        </Text>
                        <Text fontSize="2xs" color="fg.muted" flexShrink="0">
                            {formatNotificationDate(notification.createdAt)}
                        </Text>
                    </Flex>

                    <Text
                        fontSize="xs"
                        color={isUnread ? "fg" : "fg.muted"}
                        lineHeight="relaxed"
                        lineClamp={2}
                    >
                        {notification.content}
                    </Text>
                </Flex>

                {!selectionMode && (
                    <Flex
                        gap="0.5"
                        flexShrink="0"
                        opacity={{ base: 1, md: 0 }}
                        transition="opacity 0.15s ease"
                        _groupHover={{ opacity: 1 }}
                        _focusWithin={{ opacity: 1 }}
                    >
                        {isUnread && onMarkAsRead && (
                            <IconButton
                                variant="ghost"
                                size="xs"
                                aria-label="Mark as read"
                                title="Mark as read"
                                borderRadius="lg"
                                color="fg.muted"
                                _hover={{ color: "blue.600", bg: "blue.50", _dark: { bg: "blue.950" } }}
                                onClick={() => onMarkAsRead(notification.id)}
                            >
                                <LuCheck />
                            </IconButton>
                        )}
                        {onDelete && (
                            <IconButton
                                variant="ghost"
                                size="xs"
                                aria-label="Delete notification"
                                title="Delete"
                                borderRadius="lg"
                                color="fg.muted"
                                _hover={{ color: "red.500", bg: "red.50", _dark: { bg: "red.950" } }}
                                onClick={() => onDelete(notification.id)}
                            >
                                <LuTrash2 />
                            </IconButton>
                        )}
                    </Flex>
                )}
            </Flex>
        </Box>
    );
}