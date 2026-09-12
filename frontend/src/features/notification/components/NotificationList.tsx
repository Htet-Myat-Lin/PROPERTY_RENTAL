import { useMemo, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Checkbox,
    Flex,
    For,
    Icon,
    IconButton,
    Input,
    InputGroup,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuBell, LuCheck, LuCheckCheck, LuListChecks, LuSearch, LuTrash2, LuX } from "react-icons/lu";
import { NotificationItem } from "./NotificationItem";
import { useNotificationActions } from "../hooks/useNotificationActions";
import { Pagination } from "@/features/property/components/property-listing/Pagination";
import { useAppStore } from "@/app/store";
import type { Notification } from "../type";

const PAGE_SIZE = 10;

export function NotificationList() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const notifications = useAppStore((s) => s.notifications);
    const { markAsRead, markManyAsRead, deleteNotification, deleteMany } = useNotificationActions();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return notifications;

        return notifications.filter((notification) =>
            [notification.title, notification.content]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [notifications, query]);

    const unreadCount = useMemo(
        () => notifications.filter((notification) => !notification.isRead).length,
        [notifications]
    );

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, pageCount);
    const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const existingIds = useMemo(() => new Set(notifications.map((n) => n.id)), [notifications]);
    const effectiveSelected = useMemo(
        () => new Set([...selectedIds].filter((id) => existingIds.has(id))),
        [selectedIds, existingIds]
    );
    const allFilteredSelected = filtered.length > 0 && filtered.every((n) => effectiveSelected.has(n.id));

    function handleMarkAllAsRead() {
        const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
        markManyAsRead(unreadIds);
    }

    function handleMarkSelectedAsRead() {
        const ids = notifications
            .filter((n) => effectiveSelected.has(n.id) && !n.isRead)
            .map((n) => n.id);
        markManyAsRead(ids);
        setSelectedIds(new Set());
    }

    function handleDeleteSelected() {
        deleteMany([...effectiveSelected]);
        setSelectedIds(new Set());
    }

    function handleMarkOneAsRead(notificationId: string) {
        markAsRead(notificationId);
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(notificationId);
            return next;
        });
    }

    function handleDeleteOne(notificationId: string) {
        deleteNotification(notificationId);
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(notificationId);
            return next;
        });
    }

    function toggleSelect(notificationId: string) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(notificationId)) next.delete(notificationId);
            else next.add(notificationId);
            return next;
        });
    }

    function toggleSelectAll() {
        setSelectedIds(allFilteredSelected ? new Set() : new Set(filtered.map((n) => n.id)));
    }

    function enterSelectionMode() {
        setSelectionMode(true);
        setSelectedIds(new Set());
    }

    function exitSelectionMode() {
        setSelectionMode(false);
        setSelectedIds(new Set());
    }

    return (
        <Flex direction="column" height="100%" minH="0">
            <Flex
                alignItems="center"
                justifyContent="space-between"
                px="4"
                pt="4"
                pb="3"
                gap="2"
                flexShrink={0}
            >
                <Flex align="center" gap="2">
                    <Text fontSize="lg" fontWeight="bold">
                        Notifications
                    </Text>
                    {unreadCount > 0 && (
                        <Badge
                            size="sm"
                            colorPalette="blue"
                            variant="solid"
                            borderRadius="full"
                            px="2"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Flex>

                <Flex align="center" gap="1">
                    <Button
                        size="xs"
                        variant="ghost"
                        borderRadius="lg"
                        color="fg.muted"
                        _hover={{ color: "blue.600", bg: "blue.50", _dark: { bg: "blue.950" } }}
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        <LuCheckCheck />
                        <Box as="span" display={{ base: "none", md: "inline" }}>
                            Mark all read
                        </Box>
                    </Button>

                    {selectionMode ? (
                        <IconButton
                            variant="ghost"
                            size="xs"
                            aria-label="Cancel selection"
                            title="Cancel selection"
                            borderRadius="lg"
                            color="fg.muted"
                            _hover={{ color: "red.500", bg: "red.50", _dark: { bg: "red.950" } }}
                            onClick={exitSelectionMode}
                        >
                            <LuX />
                        </IconButton>
                    ) : (
                        <IconButton
                            variant="ghost"
                            size="xs"
                            aria-label="Select notifications"
                            title="Select"
                            borderRadius="lg"
                            color="fg.muted"
                            _hover={{ color: "blue.600", bg: "blue.50", _dark: { bg: "blue.950" } }}
                            onClick={enterSelectionMode}
                            disabled={notifications.length === 0}
                        >
                            <LuListChecks />
                        </IconButton>
                    )}
                </Flex>
            </Flex>

            {selectionMode && (
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    gap="2"
                    px="4"
                    pb="3"
                    flexShrink={0}
                >
                    <Flex align="center" gap="3">
                        <Checkbox.Root
                            checked={allFilteredSelected}
                            onChange={toggleSelectAll}
                            aria-label="Select all visible"
                        >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control
                                borderRadius="md"
                                _checked={{ bg: "blue.500", borderColor: "blue.500" }}
                            />
                        </Checkbox.Root>
                        <Text fontSize="sm" fontWeight="medium">
                            {effectiveSelected.size} selected
                        </Text>
                    </Flex>

                    <Flex align="center" gap="1.5">
                        <Button
                            size="xs"
                            variant="subtle"
                            colorPalette="blue"
                            borderRadius="lg"
                            onClick={handleMarkSelectedAsRead}
                            disabled={effectiveSelected.size === 0}
                        >
                            <LuCheck />
                            Mark read
                        </Button>
                        <Button
                            size="xs"
                            variant="subtle"
                            colorPalette="red"
                            borderRadius="lg"
                            onClick={handleDeleteSelected}
                            disabled={effectiveSelected.size === 0}
                        >
                            <LuTrash2 />
                            Delete
                        </Button>
                    </Flex>
                </Flex>
            )}

            <VStack gap="3" px="4" pb="3" flexShrink={0}>
                <InputGroup flex="1" startElement={<LuSearch color="var(--chakra-colors-fg-muted)" />}>
                    <Input
                        placeholder="Search notifications..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
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
                css={{
                    "&::-webkit-scrollbar": { width: "4px" },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                    "&::-webkit-scrollbar-thumb": {
                        background: "var(--chakra-colors-border-emphasized)",
                        borderRadius: "full",
                    },
                }}
            >
                {filtered.length > 0 ? (
                    <For each={pageItems}>
                        {(notification: Notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                selectionMode={selectionMode}
                                selected={effectiveSelected.has(notification.id)}
                                onToggleSelect={toggleSelect}
                                onMarkAsRead={handleMarkOneAsRead}
                                onDelete={handleDeleteOne}
                            />
                        )}
                    </For>
                ) : notifications.length > 0 ? (
                    <Flex flex="1" alignItems="center" justifyContent="center" py="8" px="4">
                        <Text fontSize="sm" color="fg.muted" textAlign="center">
                            No notifications match &ldquo;{query}&rdquo;
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
                            <Icon as={LuBell} boxSize="5" />
                        </Flex>
                        <Text fontSize="sm" color="fg.muted" textAlign="center" lineHeight="tall">
                            You have no notifications yet. New updates will appear here.
                        </Text>
                    </Flex>
                )}
            </Flex>

            {pageCount > 1 && (
                <Box flexShrink={0} borderTop="1px solid" borderColor="border.muted">
                    <Pagination page={safePage} totalPages={pageCount} onPageChange={setPage} />
                </Box>
            )}
        </Flex>
    );
}