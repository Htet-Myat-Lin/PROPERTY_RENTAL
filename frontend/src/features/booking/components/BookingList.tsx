import {
    Box,
    Button,
    Center,
    Flex,
    HStack,
    Icon,
    IconButton,
    Input,
    Menu,
    Portal,
    Spinner,
    Stack,
    Text,
    VStack,
    Badge,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LuCalendarDays, LuFilter, LuUsers } from "react-icons/lu";
import { useAppStore } from "@/app/store";
import { useGetBookings } from "../hooks/useGetBookings";
import { BookingTable } from "./BookingTable";
import { Pagination } from "@/features/property/components/property-listing/Pagination";
import type { IBooking } from "../types";

const PAGE_SIZE = 8;

const statusOptions = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
];

export function BookingList() {
    const user = useAppStore((s) => s.user);
    const isLandlord = user?.role === "LANDLORD";
    const { data, isPending } = useGetBookings(user?.role);

    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);

    const filteredBookings = useMemo(() => {
        const bookings: IBooking[] = data?.content?.bookings ?? [];
        const query = searchInput.trim().toLowerCase();
        return bookings.filter((booking) => {
            if (!query) return true;
            const personName = isLandlord
                ? booking.tenant?.username?.toLowerCase() || ""
                : booking.landlord?.username?.toLowerCase() || "";
            const propertyTitle = booking.property?.title?.toLowerCase() || "";
            const phone = booking.phoneNumber?.toLowerCase() || "";
            return (
                personName.includes(query) ||
                propertyTitle.includes(query) ||
                phone.includes(query)
            );
        });
    }, [data?.content?.bookings, searchInput, isLandlord]);

    const paginatedBookings = useMemo(() => {
        const statusFiltered = statusFilter === "accepted"
                ? filteredBookings.filter((b) => b.status === "ACCEPT")
                : statusFilter === "rejected"
                ? filteredBookings.filter((b) => b.status === "REJECT")
                : statusFilter === "pending"
                ? filteredBookings.filter((b) => b.status === "PENDING")
                : filteredBookings;

        const totalPages = Math.ceil(statusFiltered.length / PAGE_SIZE);
        const safePage = Math.min(page, Math.max(1, totalPages));
        const start = (safePage - 1) * PAGE_SIZE;
        return {
            items: statusFiltered.slice(start, start + PAGE_SIZE),
            totalPages,
            safePage,
        };
    }, [filteredBookings, statusFilter, page]);

    const hasActiveFilters = Boolean(searchInput) || Boolean(statusFilter);

    const resetFilter = () => {
        setSearchInput("");
        setStatusFilter("");
        setPage(1);
    };

    return (
        <Stack gap="6">
            {/* ─── Page Header ─── */}
            <Box>
                <HStack gap={2} mb={1}>
                    <Icon as={LuCalendarDays} boxSize={6} color="blue.500" />
                    <Text fontSize="xl" fontWeight="bold" color="fg">
                        Bookings List
                    </Text>
                </HStack>
                <Text fontSize="sm" color="fg.muted">
                    Manage and monitor all your bookings in one place. View details, update statuses, and keep track of your appointments with ease.
                </Text>
            </Box>

            {/* ─── Filters & Search Bar ─── */}
            <Box
                bg="bg.panel"
                borderRadius="xl"
                border="1px solid"
                borderColor="border.muted"
                p={4}
            >
                <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={3}
                    align={{ base: "stretch", md: "center" }}
                    justify="space-between"
                >
                    {/* Search Input */}
                    <HStack gap="0" flex={1} maxW={{ md: "320px" }}>
                        <Input
                            placeholder="Search by name, property or phone..."
                            size="sm"
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setPage(1);
                            }}
                            borderRightRadius="0"
                            borderRadius="lg"
                            bg="bg.subtle"
                            _dark={{ bg: "whiteAlpha.50" }}
                        />
                        <IconButton
                            aria-label="Search"
                            size="sm"
                            borderLeftRadius="0"
                            borderRightRadius="lg"
                            variant="solid"
                            colorPalette="blue"
                        >
                            <FaSearch />
                        </IconButton>
                    </HStack>

                    {/* Status Filter */}
                    <HStack wrap="wrap" gap="2">
                        <Menu.Root>
                            <Menu.Trigger asChild>
                                <Button variant="outline" size="sm" borderRadius="lg" gap={2}>
                                    <Icon as={LuFilter} boxSize={4} />
                                    {statusFilter
                                        ? statusOptions.find((s) => s.value === statusFilter)?.label
                                        : "Status"}
                                </Button>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content minW="10rem" bg="bg.panel" borderRadius="lg">
                                        <Menu.RadioItemGroup
                                            value={statusFilter}
                                            onValueChange={(e) => {
                                                setStatusFilter(e.value);
                                                setPage(1);
                                            }}
                                        >
                                            {statusOptions.map((item) => (
                                                <Menu.RadioItem key={item.value} value={item.value}>
                                                    {item.label}
                                                    <Menu.ItemIndicator />
                                                </Menu.RadioItem>
                                            ))}
                                        </Menu.RadioItemGroup>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                borderRadius="lg"
                                color="fg.muted"
                                onClick={resetFilter}
                            >
                                Clear
                            </Button>
                        )}
                    </HStack>
                </Flex>

                {/* Active filter badges */}
                {searchInput.trim() && (
                    <HStack mt={3} gap={2} flexWrap="wrap">
                        <Badge variant="subtle" colorPalette="blue" borderRadius="full" px={3} py={1}>
                            Search: {searchInput.trim()}
                        </Badge>
                    </HStack>
                )}
            </Box>

            {/* ─── Content Section ─── */}
            {isPending ? (
                <Center minH="40vh">
                    <VStack gap={4}>
                        <Spinner color="blue.500" size="xl" borderWidth="3px" />
                        <Text color="fg.muted" fontSize="sm">
                            Loading bookings...
                        </Text>
                    </VStack>
                </Center>
            ) : (
                <>
                    {paginatedBookings.items.length === 0 ? (
                        <Center
                            minH="30vh"
                            borderWidth="2px"
                            borderStyle="dashed"
                            borderColor="border.muted"
                            borderRadius="xl"
                            flexDirection="column"
                            gap="4"
                            p={8}
                        >
                            <Box
                                w="60px"
                                h="60px"
                                borderRadius="full"
                                bg="blue.50"
                                _dark={{ bg: "blue.950" }}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={LuUsers} boxSize={7} color="blue.500" />
                            </Box>
                            <VStack gap={1}>
                                <Text fontWeight="semibold" color="fg">
                                    No bookings found
                                </Text>
                                <Text color="fg.muted" fontSize="sm" textAlign="center">
                                    {hasActiveFilters
                                        ? "Try adjusting your search or status filter"
                                        : "You do not have any tour bookings yet"}
                                </Text>
                            </VStack>
                            {hasActiveFilters && (
                                <Button size="sm" variant="outline" borderRadius="lg" onClick={resetFilter}>
                                    Reset Filters
                                </Button>
                            )}
                        </Center>
                    ) : (
                        <Box
                            bg="bg.panel"
                            borderRadius="xl"
                            border="1px solid"
                            borderColor="border.muted"
                            overflow="hidden"
                        >
                            <BookingTable
                                items={paginatedBookings.items}
                                mode={isLandlord ? "landlord" : "tenant"}
                            />
                        </Box>
                    )}

                    {/* ─── Pagination ─── */}
                    {paginatedBookings.totalPages > 1 && (
                        <Pagination
                            page={paginatedBookings.safePage}
                            totalPages={paginatedBookings.totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </Stack>
    );
}