import type { BookingStatus } from "../types";

export const bookingStatusMeta: Record<BookingStatus, { label: string; colorPalette: string }> = {
    PENDING: { label: "Pending", colorPalette: "gray" },
    ACCEPT: { label: "Accepted", colorPalette: "green" },
    REJECT: { label: "Rejected", colorPalette: "red" },
};