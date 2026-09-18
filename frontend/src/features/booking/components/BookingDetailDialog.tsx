import { Box, Badge, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import type { IBooking } from "../types";
import { formateDate } from "@/utils/format-date";
import { bookingStatusMeta } from "../utils/status";
import { bookingDateLabel } from "../utils/date";

export function BookingDetailDialog({ booking }: { booking: IBooking }) {
    const statusMeta = bookingStatusMeta[booking.status];
    return (
        <Box my="5" maxH="80vh" overflowY="auto">
            <Flex justify="space-between" align="center" mb="4">
                <Heading size="lg">Booking Details</Heading>
                <Badge
                    variant="subtle"
                    colorPalette={statusMeta.colorPalette}
                    borderRadius="full"
                    size="sm"
                    px={3}
                >
                    {statusMeta.label}
                </Badge>
            </Flex>
            <Stack gap="4">
                {/* Property Information */}
                <Box p="4" borderWidth="1px" borderRadius="md" bg="bg.subtle">
                    <Heading size="sm" mb="3">Property</Heading>
                    <Stack gap="2">
                        <Flex justify="space-between">
                            <Text fontWeight="medium">Title:</Text>
                            <Text maxW="70%" textAlign="right">{booking.property?.title || "—"}</Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text fontWeight="medium">Rent Price:</Text>
                            <Text fontWeight="bold" color="blue.600">
                                {booking.property?.baseRentPrice?.toLocaleString()} ks
                            </Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text fontWeight="medium">Type:</Text>
                            <Text>{booking.property?.propertyType || "—"}</Text>
                        </Flex>
                        {booking.property?.locationAddress && (
                            <Flex justify="space-between">
                                <Text fontWeight="medium">Address:</Text>
                                <Text maxW="70%" textAlign="right" fontSize="sm">{booking.property.locationAddress}</Text>
                            </Flex>
                        )}
                    </Stack>
                </Box>

                {/* Tenant Information */}
                <Box p="4" borderWidth="1px" borderRadius="md" bg="bg.subtle">
                    <Heading size="sm" mb="3">Tenant</Heading>
                    <Stack gap="2">
                        <Flex justify="space-between">
                            <Text fontWeight="medium">Name:</Text>
                            <Text>{booking.tenant?.username || booking.tenant?.email || "—"}</Text>
                        </Flex>
                        {booking.tenant?.email && (
                            <Flex justify="space-between">
                                <Text fontWeight="medium">Email:</Text>
                                <Text fontSize="sm">{booking.tenant.email}</Text>
                            </Flex>
                        )}
                        <Flex justify="space-between">
                            <Text fontWeight="medium">Phone:</Text>
                            <Text>{booking.phoneNumber || "—"}</Text>
                        </Flex>
                    </Stack>
                </Box>

                {/* Landlord Information */}
                <Box p="4" borderWidth="1px" borderRadius="md" bg="bg.subtle">
                    <Heading size="sm" mb="3">Landlord</Heading>
                    <Stack gap="2">
                        <Flex justify="space-between">
                            <Text fontWeight="medium">Name:</Text>
                            <Text>{booking.landlord?.username || booking.landlord?.email || "—"}</Text>
                        </Flex>
                        {booking.landlord?.email && (
                            <Flex justify="space-between">
                                <Text fontWeight="medium">Email:</Text>
                                <Text fontSize="sm">{booking.landlord.email}</Text>
                            </Flex>
                        )}
                    </Stack>
                </Box>

                {/* Schedules */}
                <Box p="4" borderWidth="1px" borderRadius="md" bg="bg.subtle">
                    <Heading size="sm" mb="3">Requested Tour Schedules</Heading>
                    {Array.isArray(booking.schedules) && booking.schedules.length > 0 ? (
                        <Stack gap="2">
                            {booking.schedules.map((s, index) => (
                                <Flex key={index} justify="space-between">
                                    <Text fontWeight="medium">Option {index + 1}:</Text>
                                    <Text>{`${bookingDateLabel(s.date)} at ${s.time}`}</Text>
                                </Flex>
                            ))}
                        </Stack>
                    ) : (
                        <Text color="fg.muted" fontSize="sm">No schedules provided</Text>
                    )}
                </Box>

                {/* Remarks */}
                <Box p="4" borderWidth="1px" borderRadius="md" bg="bg.subtle">
                    <Heading size="sm" mb="3">Remarks</Heading>
                    <Text fontSize="sm" color="fg.muted">
                        {booking.remarks || "No remarks provided"}
                    </Text>
                </Box>

                {/* Dates */}
                <Box p="4" borderWidth="1px" borderRadius="md" bg="bg.subtle">
                    <Heading size="sm" mb="3">Info</Heading>
                    <Stack gap="2">
                        <Flex justify="space-between">
                            <Text fontWeight="medium">Requested on:</Text>
                            <Text fontSize="sm">{formateDate(booking.createdAt)}</Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text fontWeight="medium">Last Updated:</Text>
                            <Text fontSize="sm">{formateDate(booking.updatedAt)}</Text>
                        </Flex>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}