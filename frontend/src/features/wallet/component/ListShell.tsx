"use client";

import {
    Badge,
    Box,
    Button,
    Center,
    HStack,
    Icon,
    Menu,
    Portal,
    Spinner,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import type { ElementType, ReactNode } from "react";
import { LuFilter, LuInbox, LuX } from "react-icons/lu";
import { getApiErrorMessage } from "@/utils/api-error";
import { Pagination } from "@/features/property/components/property-listing/Pagination";

export type FilterOption = { label: string; value: string };

type ListShellProps = {
    title: string;
    subtitle: string;
    icon: ElementType;
    totalCount: number;
    isPending: boolean;
    isError: boolean;
    error: unknown;
    emptyMessage: string;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    filters?: {
        /** Value of the selected option, or undefined for "all". */
        activeValue?: string;
        /** Label shown on the trigger while "all" is selected. */
        triggerLabel: string;
        options: FilterOption[];
        onChange: (value: string) => void;
    };
    children: ReactNode;
};

/**
 * Shared chrome for the wallet side panels: heading, optional single-select
 * filter, the pending/error/empty states, and pagination. The panel is always
 * rendered so the page keeps a stable height while a query is in flight.
 */
export function ListShell({
    title,
    subtitle,
    icon,
    totalCount,
    isPending,
    isError,
    error,
    emptyMessage,
    page,
    totalPages,
    onPageChange,
    filters,
    children,
}: ListShellProps) {
    const activeOption = filters?.options.find((option) => option.value === filters?.activeValue);
    const activeLabel = activeOption?.label;

    return (
        <Box
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border.muted"
            borderRadius="xl"
            overflow="hidden"
        >
            <HStack
                justify="space-between"
                align="center"
                gap={3}
                px={5}
                py={4}
                borderBottomWidth="1px"
                borderColor="border.muted"
            >
                <HStack gap={3} minW={0}>
                    <FlexIcon icon={icon} />
                    <Box minW={0}>
                        <HStack gap={2}>
                            <Text fontSize="sm" fontWeight="semibold" color="fg" truncate>
                                {title}
                            </Text>
                            {totalCount > 0 && (
                                <Badge
                                    colorPalette="gray"
                                    variant="subtle"
                                    borderRadius="full"
                                    size="sm"
                                    flexShrink={0}
                                >
                                    {totalCount}
                                </Badge>
                            )}
                        </HStack>
                        <Text fontSize="xs" color="fg.muted" truncate>
                            {subtitle}
                        </Text>
                    </Box>
                </HStack>

                {filters && (
                    <HStack gap={1} flexShrink={0}>
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <Button
                                    variant={activeOption ? "subtle" : "ghost"}
                                    colorPalette={activeOption ? "blue" : "gray"}
                                    size="xs"
                                    borderRadius="lg"
                                    gap={1}
                                >
                                    <Icon as={LuFilter} boxSize={3.5} />
                                    {activeLabel ?? filters.triggerLabel}
                                </Button>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content minW="9rem" bg="bg.panel" borderRadius="lg">
                                        <Menu.RadioItemGroup
                                            value={filters.activeValue ?? ""}
                                            onValueChange={(e) => filters.onChange(e.value)}
                                        >
                                            {filters.options.map((option) => (
                                                <Menu.RadioItem key={option.label} value={option.value}>
                                                    {option.label}
                                                    <Menu.ItemIndicator />
                                                </Menu.RadioItem>
                                            ))}
                                        </Menu.RadioItemGroup>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>

                        {activeOption && (
                            <Button
                                variant="ghost"
                                size="xs"
                                color="fg.muted"
                                borderRadius="lg"
                                onClick={() => filters.onChange("")}
                                aria-label="Clear filter"
                            >
                                <Icon as={LuX} boxSize={3.5} />
                            </Button>
                        )}
                    </HStack>
                )}
            </HStack>

            <Box px={5} py={4}>
                {isPending ? (
                    <Center minH="32">
                        <Spinner color="blue.500" size="md" borderWidth="3px" />
                    </Center>
                ) : isError ? (
                    <Center minH="32">
                        <Text color="red.500" fontSize="sm" textAlign="center">
                            {getApiErrorMessage(error, `Could not load ${title.toLowerCase()}`)}
                        </Text>
                    </Center>
                ) : totalCount === 0 ? (
                    <Center minH="32" flexDirection="column" gap={2} textAlign="center">
                        <Icon as={LuInbox} boxSize={6} color="fg.muted" />
                        <Text fontSize="sm" color="fg.muted">
                            {emptyMessage}
                        </Text>
                    </Center>
                ) : (
                    <Stack gap={0}>{children}</Stack>
                )}
            </Box>

            {!isPending && !isError && totalCount > 0 && (
                <Box borderTopWidth="1px" borderColor="border.muted" pt={1}>
                    <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
                </Box>
            )}
        </Box>
    );
}

function FlexIcon({ icon }: { icon: ElementType }) {
    return (
        <Box
            colorPalette="blue"
            bg="colorPalette.subtle"
            color="colorPalette.fg"
            boxSize={9}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
        >
            <Icon as={icon} boxSize={4.5} />
        </Box>
    );
}

/** Shared row layout for the wallet lists: label + amount on top, meta beneath. */
export function ListRow({
    title,
    subtitle,
    amount,
    amountColor = "fg",
    trailing,
}: {
    title: ReactNode;
    subtitle: ReactNode;
    amount: string;
    amountColor?: string;
    trailing?: ReactNode;
}) {
    return (
        <HStack
            justify="space-between"
            align="center"
            gap={3}
            py={3}
            borderBottomWidth="1px"
            borderColor="border.muted"
        >
            <VStack gap={0.5} align="flex-start" minW={0}>
                <HStack gap={2} minW={0}>
                    <Text fontSize="sm" fontWeight="medium" color="fg" truncate>
                        {title}
                    </Text>
                    {trailing}
                </HStack>
                <Text fontSize="xs" color="fg.muted" truncate>
                    {subtitle}
                </Text>
            </VStack>
            <Text
                fontSize="sm"
                fontWeight="semibold"
                color={amountColor}
                fontVariantNumeric="tabular-nums"
                flexShrink={0}
            >
                {amount}
            </Text>
        </HStack>
    );
}
