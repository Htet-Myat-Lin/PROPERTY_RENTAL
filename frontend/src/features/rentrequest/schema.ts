import { z } from "zod";
import type { RentRequestStatus } from "./types";

export const RENT_REQUEST_STATUS_OPTIONS: { label: string; value: RentRequestStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Pick a valid date");

/**
 * The dialog passes the listing's `leaseTermMonths` so the term field can be
 * locked when a landlord only accepts one fixed term. The server rejects a
 * mismatched term anyway, so this is UX rather than the source of truth.
 */
export const rentRequestFormSchema = (leaseTermMonths?: number | null) =>
  z
    .object({
      startDate: isoDate,
      endDate: isoDate,
      durationMonths: z.coerce
        .number({ message: "Enter the lease length" })
        .int("Use whole months")
        .min(1, "Lease must be at least 1 month")
        .max(120, "Lease cannot exceed 120 months"),
      message: z.string().trim().max(1000, "Message cannot exceed 1000 characters").optional(),
    })
    .refine((value) => Date.parse(value.endDate) > Date.parse(value.startDate), {
      path: ["endDate"],
      message: "End date must be after the start date",
    })
    .refine(
      (value) => !leaseTermMonths || value.durationMonths === leaseTermMonths,
      {
        path: ["durationMonths"],
        message: `This listing only accepts a ${leaseTermMonths} month lease`,
      },
    );

export type RentRequestFormValues = z.infer<ReturnType<typeof rentRequestFormSchema>>;

/** Adds `n` months to an ISO date, returning a fresh ISO date. */
export const addMonths = (isoDate: string, months: number): string => {
  const date = new Date(isoDate);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
};

export const todayIso = (): string => new Date().toISOString().slice(0, 10);