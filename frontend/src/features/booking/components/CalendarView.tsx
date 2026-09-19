import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";

// stylesheets
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/purple.css";

import {
    Avatar,
    Badge,
    Box,
    CloseButton,
    Dialog,
    Flex,
    HStack,
    Portal,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuBuilding2, LuCalendarDays, LuClock, LuPhone } from "react-icons/lu";
import { useState } from "react";
import { useColorMode } from "@/components/ui/color-mode";
import { useGetBookings } from "../hooks/useGetBookings";
import { bookingDateLabel, timeSlotToTime } from "../utils/date";
import { bookingStatusMeta } from "../utils/status";
import type { BookingStatus, IBooking } from "../types";

const statusColors: Record<BookingStatus, string> = {
    PENDING: "#eab308",
    ACCEPT: "#22c55e",
    REJECT: "#ef4444",
};

type BookingEventData = {
    tenant: string;
    status: BookingStatus;
    date: string;
    time: string;
    phone: string;
    propertyTitle: string;
};

export function CalendarView() {
    const { colorMode } = useColorMode();
    const { data } = useGetBookings("LANDLORD");
    const [selected, setSelected] = useState<BookingEventData | null>(null);
    const bookings = data?.content?.bookings;
    const events = bookings?.flatMap((b: IBooking) =>
        b.schedules.map((s) => ({
            title: "Visit booking",
            start: `${s.date}T${timeSlotToTime(s.time)}`,
            allDay: false,
            extendedProps: {
                tenant: b.tenant?.username || b.tenant?.email || "—",
                status: b.status,
                date: s.date,
                time: s.time,
                phone: b.phoneNumber || "—",
                propertyTitle: b.property?.title || "—",
            },
        }))
    );
    const statusMeta = selected ? bookingStatusMeta[selected.status] : null;

    return (
        <>
            <FullCalendar
                plugins={[themePlugin, dayGridPlugin, timeGridPlugin]}
                colorScheme={colorMode}
                initialView="dayGridMonth"
                events={events}
                weekends
                navLinks
                eventDisplay="block"
                eventMinHeight={26}
                eventTimeFormat={{
                    hour: "numeric",
                    minute: "2-digit",
                    meridiem: "short",
                }}
                eventClick={(info) => setSelected(info.event.extendedProps as BookingEventData)}
                eventContent={(arg) => {
                    const data = arg.event.extendedProps as BookingEventData;
                    const color = statusColors[data.status];
                    return (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                maxWidth: "100%",
                                minWidth: 0,
                                width: "100%",
                                padding: "4px 8px",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, rgba(80, 59, 118, 0.96), rgba(106, 81, 151, 0.96))",
                                color: "#f4f1fb",
                                fontSize: "11px",
                                fontWeight: 600,
                                overflow: "hidden",
                                boxShadow: "0 4px 12px rgba(76, 61, 105, 0.16)",
                            }}
                        >
                            <span
                                style={{
                                    width: "7px",
                                    height: "7px",
                                    borderRadius: "9999px",
                                    backgroundColor: color,
                                    flexShrink: 0,
                                    boxShadow: "0 0 0 2px rgba(255,255,255,0.18)",
                                }}
                            />
                            <span style={{ opacity: 0.9, fontSize: "10px", fontWeight: 600, flexShrink: 0, letterSpacing: "0.02em" }}>
                                {data.time}
                            </span>
                            <span
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    minWidth: 0,
                                    flex: "1 1 auto",
                                }}
                            >
                                {`${data.tenant} ${data.propertyTitle}`}
                            </span>
                        </span>
                    );
                }}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek",
                }}
            />

            <Dialog.Root
                placement="center"
                size="md"
                open={!!selected}
                onOpenChange={(e) => {
                    if (!e.open) setSelected(null);
                }}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content borderRadius="xl">
                            <Dialog.Header>
                                <Flex justify="space-between" align="center" w="full" pr="8">
                                    <Dialog.Title>Visit Booking</Dialog.Title>
                                    {statusMeta && (
                                        <Badge
                                            variant="subtle"
                                            colorPalette={statusMeta.colorPalette}
                                            borderRadius="full"
                                            size="sm"
                                            px={3}
                                        >
                                            {statusMeta.label}
                                        </Badge>
                                    )}
                                </Flex>
                            </Dialog.Header>
                            <Dialog.Body>
                                {selected && (
                                    <VStack align="stretch" gap="4">
                                        <HStack gap="3">
                                            <Avatar.Root size="md" colorPalette={statusMeta?.colorPalette}>
                                                <Avatar.Fallback name={selected.tenant} />
                                            </Avatar.Root>
                                            <Box>
                                                <Text fontWeight="semibold">{selected.tenant}</Text>
                                                <Text fontSize="xs" color="fg.muted">Tenant</Text>
                                            </Box>
                                        </HStack>

                                        <Box
                                            p="3"
                                            borderRadius="md"
                                            borderWidth="1px"
                                            borderColor="border.muted"
                                            bg="bg.muted"
                                        >
                                            <Flex gap="2" align="center" mb="1">
                                                <LuBuilding2 size={14} />
                                                <Text
                                                    fontSize="xs"
                                                    color="fg.muted"
                                                    fontWeight="semibold"
                                                    textTransform="uppercase"
                                                    letterSpacing="wider"
                                                >
                                                    Property
                                                </Text>
                                            </Flex>
                                            <Text fontSize="sm" fontWeight="medium" lineClamp={1}>{selected.propertyTitle}</Text>
                                        </Box>

                                        <SimpleGrid columns={3} gap="3">
                                            <Box p="3" borderRadius="md" borderWidth="1px" borderColor="border.muted">
                                                <HStack gap="1.5" mb="1">
                                                    <LuCalendarDays size={13} />
                                                    <Text fontSize="xs" color="fg.muted" fontWeight="semibold">
                                                        Date
                                                    </Text>
                                                </HStack>
                                                <Text fontSize="sm" fontWeight="medium">
                                                    {bookingDateLabel(selected.date)}
                                                </Text>
                                            </Box>
                                            <Box p="3" borderRadius="md" borderWidth="1px" borderColor="border.muted">
                                                <HStack gap="1.5" mb="1">
                                                    <LuClock size={13} />
                                                    <Text fontSize="xs" color="fg.muted" fontWeight="semibold">
                                                        Time
                                                    </Text>
                                                </HStack>
                                                <Text fontSize="sm" fontWeight="medium">
                                                    {selected.time}
                                                </Text>
                                            </Box>
                                            <Box p="3" borderRadius="md" borderWidth="1px" borderColor="border.muted">
                                                <HStack gap="1.5" mb="1">
                                                    <LuPhone size={13} />
                                                    <Text fontSize="xs" color="fg.muted" fontWeight="semibold">
                                                        Phone
                                                    </Text>
                                                </HStack>
                                                <Text fontSize="sm" fontWeight="medium" lineClamp={1}>{selected.phone}</Text>
                                            </Box>
                                        </SimpleGrid>
                                    </VStack>
                                )}
                            </Dialog.Body>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
}