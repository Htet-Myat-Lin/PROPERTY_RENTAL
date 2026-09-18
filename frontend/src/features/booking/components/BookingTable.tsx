import {
    Table,
    HStack,
    Dialog,
    Portal,
    Button,
    CloseButton,
    Badge,
    Text,
    Textarea,
    IconButton,
} from "@chakra-ui/react";
import type { IBooking } from "../types";
import { formateDate } from "@/utils/format-date";
import { FiEdit3, FiEye, FiTrash2 } from "react-icons/fi";
import { LuCheck, LuX } from "react-icons/lu";
import { useAcceptBooking } from "../hooks/useAcceptBooking";
import { useRejectBooking } from "../hooks/useRejectBooking";
import { useDeleteBooking } from "../hooks/useDeleteBooking";
import { BookingDetailDialog } from "./BookingDetailDialog";
import { BookingEditDialog } from "./BookingEditDialog";
import { bookingStatusMeta } from "../utils/status";
import { bookingDateLabel } from "../utils/date";
import { useState } from "react";

type Props = {
    items: IBooking[];
    mode?: "landlord" | "tenant";
};

export function BookingTable({ items, mode = "landlord" }: Props) {
    const isTenantMode = mode === "tenant";
    const [editingBooking, setEditingBooking] = useState<IBooking | null>(null);
    const [acceptingBooking, setAcceptingBooking] = useState<IBooking | null>(null);
    const [acceptRemark, setAcceptRemark] = useState("");
    const [rejectingBooking, setRejectingBooking] = useState<IBooking | null>(null);
    const [rejectRemark, setRejectRemark] = useState("");

    const { mutate: acceptBooking, isPending: isAccepting } = useAcceptBooking();
    const { mutate: rejectBooking, isPending: isRejecting } = useRejectBooking();
    const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();

    const personColumnLabel = isTenantMode ? "Landlord" : "Tenant";
    const personName = (item: IBooking) =>
        isTenantMode
            ? item.landlord?.username || item.landlordId
            : item.tenant?.username || item.tenantId;

    const openAccept = (item: IBooking) => {
        setAcceptRemark("");
        setAcceptingBooking(item);
    };

    const confirmAccept = () => {
        if (!acceptingBooking) return;
        acceptBooking(
            { bookingId: acceptingBooking.id, remarks: acceptRemark.trim() || undefined },
            { onSuccess: () => setAcceptingBooking(null) }
        );
    };

    const openReject = (item: IBooking) => {
        setRejectRemark("");
        setRejectingBooking(item);
    };

    const confirmReject = () => {
        if (!rejectingBooking) return;
        rejectBooking(
            { bookingId: rejectingBooking.id, remarks: rejectRemark.trim() || undefined },
            { onSuccess: () => setRejectingBooking(null) }
        );
    };

    return (
        <>
            <Table.Root size="sm" variant="outline" showColumnBorder>
                <Table.Header>
                    <Table.Row bg="bg.subtle" _dark={{ bg: "whiteAlpha.50" }}>
                        <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                            {personColumnLabel}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                            Property
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                            Phone
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                            Schedules
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                            Requested
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                            Status
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
                            Remarks
                        </Table.ColumnHeader>
                        <Table.ColumnHeader fontWeight="semibold" fontSize="xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted" textAlign="center">
                            Actions
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {items.map((item) => (
                        <Table.Row
                            key={item.id}
                            transition="background 0.15s"
                            _hover={{ bg: "bg.subtle", _dark: { bg: "whiteAlpha.50" } }}
                        >
                            <Table.Cell>
                                <Text fontWeight="medium" fontSize="sm">
                                    {personName(item)}
                                </Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text fontSize="sm" lineClamp={1} maxW="220px">
                                    {item.property?.title || item.propertyId}
                                </Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Text fontSize="sm" color="fg.muted">
                                    {item.phoneNumber || "—"}
                                </Text>
                            </Table.Cell>
                            <Table.Cell>
                                <HStack gap={1} wrap="wrap">
                                    {Array.isArray(item.schedules) &&
                                        item.schedules.map((s, index) => (
                                            <Badge key={index} variant="subtle" colorPalette="blue" borderRadius="full" size="sm">
                                                {`${bookingDateLabel(s.date)} • ${s.time}`}
                                            </Badge>
                                        ))}
                                </HStack>
                            </Table.Cell>
                            <Table.Cell>
                                <Text fontSize="sm" color="fg.muted">
                                    {formateDate(item.createdAt)}
                                </Text>
                            </Table.Cell>
                            <Table.Cell>
                                <Badge
                                    variant="subtle"
                                    colorPalette={bookingStatusMeta[item.status].colorPalette}
                                    borderRadius="full"
                                    size="sm"
                                    px={3}
                                >
                                    {bookingStatusMeta[item.status].label}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>
                                <Text
                                    fontSize="sm"
                                    color="fg.muted"
                                    lineClamp={2}
                                    maxW="160px"
                                    title={item.remarks || ""}
                                >
                                    {item.remarks || "—"}
                                </Text>
                            </Table.Cell>
                            <Table.Cell>
                                <HStack gap={1} justify="center">
                                    {/* View Detail */}
                                    <Dialog.Root placement="center" size="lg">
                                        <Dialog.Trigger asChild>
                                            <IconButton
                                                variant="ghost"
                                                size="xs"
                                                aria-label="View booking details"
                                                color="blue.500"
                                                borderRadius="md"
                                                _hover={{ bg: "blue.50", _dark: { bg: "blue.950" } }}
                                            >
                                                <FiEye />
                                            </IconButton>
                                        </Dialog.Trigger>
                                        <Portal>
                                            <Dialog.Backdrop />
                                            <Dialog.Positioner>
                                                <Dialog.Content borderRadius="xl">
                                                    <Dialog.Header />
                                                    <Dialog.Body>
                                                        <BookingDetailDialog booking={item} />
                                                    </Dialog.Body>
                                                    <Dialog.CloseTrigger asChild>
                                                        <CloseButton size="sm" />
                                                    </Dialog.CloseTrigger>
                                                </Dialog.Content>
                                            </Dialog.Positioner>
                                        </Portal>
                                    </Dialog.Root>

                                    {isTenantMode ? (
                                        item.status === "PENDING" && (
                                            <>
                                                {/* Edit (pending only) */}
                                                <IconButton
                                                    variant="ghost"
                                                    size="xs"
                                                    aria-label="Edit booking"
                                                    color="green.500"
                                                    borderRadius="md"
                                                    _hover={{ bg: "green.50", _dark: { bg: "green.950" } }}
                                                    onClick={() => setEditingBooking(item)}
                                                >
                                                    <FiEdit3 />
                                                </IconButton>

                                                {/* Delete (pending only) */}
                                                <Dialog.Root role="alertdialog">
                                                    <Dialog.Trigger asChild>
                                                        <IconButton
                                                            variant="ghost"
                                                            size="xs"
                                                            aria-label="Delete booking"
                                                            color="red.500"
                                                            borderRadius="md"
                                                            _hover={{ bg: "red.50", _dark: { bg: "red.950" } }}
                                                            disabled={isDeleting}
                                                        >
                                                            <FiTrash2 />
                                                        </IconButton>
                                                    </Dialog.Trigger>
                                                    <Portal>
                                                        <Dialog.Backdrop />
                                                        <Dialog.Positioner>
                                                            <Dialog.Content borderRadius="xl">
                                                                <Dialog.Header>
                                                                    <Dialog.Title>Delete Booking</Dialog.Title>
                                                                </Dialog.Header>
                                                                <Dialog.Body>
                                                                    <Text color="fg.muted">
                                                                        Are you sure you want to delete this tour booking for{" "}
                                                                        <Text as="span" fontWeight="semibold" color="fg">
                                                                            {item.property?.title || "this property"}
                                                                        </Text>
                                                                        ? This action cannot be undone.
                                                                    </Text>
                                                                </Dialog.Body>
                                                                <Dialog.Footer gap={3}>
                                                                    <Dialog.ActionTrigger asChild>
                                                                        <Button variant="outline" borderRadius="lg">
                                                                            Cancel
                                                                        </Button>
                                                                    </Dialog.ActionTrigger>
                                                                    <Button
                                                                        colorPalette="red"
                                                                        borderRadius="lg"
                                                                        disabled={isDeleting}
                                                                        onClick={() => deleteBooking(item.id)}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </Dialog.Footer>
                                                                <Dialog.CloseTrigger asChild>
                                                                    <CloseButton size="sm" />
                                                                </Dialog.CloseTrigger>
                                                            </Dialog.Content>
                                                        </Dialog.Positioner>
                                                    </Portal>
                                                </Dialog.Root>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            {/* Accept (opens controlled dialog) */}
                                            <IconButton
                                                variant="ghost"
                                                size="xs"
                                                aria-label="Accept booking"
                                                color="green.500"
                                                borderRadius="md"
                                                _hover={{ bg: "green.50", _dark: { bg: "green.950" } }}
                                                disabled={item.status === "ACCEPT" || isAccepting}
                                                onClick={() => openAccept(item)}
                                            >
                                                <LuCheck />
                                            </IconButton>

                                            {/* Reject (opens controlled dialog) */}
                                            <IconButton
                                                variant="ghost"
                                                size="xs"
                                                aria-label="Reject booking"
                                                color="red.500"
                                                borderRadius="md"
                                                _hover={{ bg: "red.50", _dark: { bg: "red.950" } }}
                                                disabled={item.status === "REJECT" || isRejecting}
                                                onClick={() => openReject(item)}
                                            >
                                                <LuX />
                                            </IconButton>
                                        </>
                                    )}
                                </HStack>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            {/* ─── Accept Booking Dialog (landlord) ─── */}
            <Dialog.Root
                placement="center"
                size="md"
                open={!!acceptingBooking}
                onOpenChange={(e) => {
                    if (!e.open) setAcceptingBooking(null);
                }}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content borderRadius="xl">
                            <Dialog.Header>
                                <Dialog.Title>Accept Booking</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                {acceptingBooking && (
                                    <Text color="fg.muted" mb="3">
                                        Are you sure you want to accept this tour booking from{" "}
                                        <Text as="span" fontWeight="semibold" color="fg">
                                            {acceptingBooking.tenant?.username || "this tenant"}
                                        </Text>{" "}
                                        for{" "}
                                        <Text as="span" fontWeight="semibold" color="fg">
                                            {acceptingBooking.property?.title || "this property"}
                                        </Text>?
                                    </Text>
                                )}
                                <Text fontSize="sm" fontWeight="medium" mb="1">
                                    Remark (optional)
                                </Text>
                                <Textarea
                                    placeholder="e.g. Please bring your ID on the day of the visit…"
                                    size="sm"
                                    rows={3}
                                    resize="vertical"
                                    value={acceptRemark}
                                    onChange={(e) => setAcceptRemark(e.target.value)}
                                />
                            </Dialog.Body>
                            <Dialog.Footer gap={3}>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" borderRadius="lg">
                                        Cancel
                                    </Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    colorPalette="green"
                                    borderRadius="lg"
                                    disabled={isAccepting}
                                    onClick={confirmAccept}
                                >
                                    <LuCheck /> Accept
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            {/* ─── Reject Booking Dialog (landlord) ─── */}
            <Dialog.Root
                placement="center"
                size="md"
                open={!!rejectingBooking}
                onOpenChange={(e) => {
                    if (!e.open) setRejectingBooking(null);
                }}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content borderRadius="xl">
                            <Dialog.Header>
                                <Dialog.Title>Reject Booking</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                {rejectingBooking && (
                                    <Text color="fg.muted" mb="3">
                                        Are you sure you want to reject this tour booking from{" "}
                                        <Text as="span" fontWeight="semibold" color="fg">
                                            {rejectingBooking.tenant?.username || "this tenant"}
                                        </Text>{" "}
                                        for{" "}
                                        <Text as="span" fontWeight="semibold" color="fg">
                                            {rejectingBooking.property?.title || "this property"}
                                        </Text>?
                                    </Text>
                                )}
                                <Text fontSize="sm" fontWeight="medium" mb="1">
                                    Remark (optional)
                                </Text>
                                <Textarea
                                    placeholder="e.g. The property is no longer available at that time…"
                                    size="sm"
                                    rows={3}
                                    resize="vertical"
                                    value={rejectRemark}
                                    onChange={(e) => setRejectRemark(e.target.value)}
                                />
                            </Dialog.Body>
                            <Dialog.Footer gap={3}>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" borderRadius="lg">
                                        Cancel
                                    </Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    colorPalette="red"
                                    borderRadius="lg"
                                    disabled={isRejecting}
                                    onClick={confirmReject}
                                >
                                    <LuX /> Reject
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            {/* ─── Edit Booking Dialog (tenant) ─── */}
            <Dialog.Root
                placement="center"
                size="md"
                open={!!editingBooking}
                onOpenChange={(e) => {
                    if (!e.open) setEditingBooking(null);
                }}
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content borderRadius="xl">
                            <Dialog.Header>
                                <Dialog.Title>Edit Booking</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                {editingBooking && (
                                    <BookingEditDialog
                                        booking={editingBooking}
                                        onClose={() => setEditingBooking(null)}
                                    />
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