import type { RentRequestStatus, EscrowStatus } from "../types";

export const rentRequestStatusMeta: Record<RentRequestStatus, { label: string; colorPalette: string }> = {
  PENDING: { label: "Pending", colorPalette: "orange" },
  APPROVED: { label: "Approved", colorPalette: "green" },
  REJECTED: { label: "Rejected", colorPalette: "red" },
  CANCELLED: { label: "Cancelled", colorPalette: "gray" },
};

export const escrowStatusMeta: Record<EscrowStatus, { label: string; colorPalette: string }> = {
  PENDING: { label: "In escrow", colorPalette: "orange" },
  RELEASED: { label: "Released", colorPalette: "green" },
  REFUNDED: { label: "Refunded", colorPalette: "gray" },
};