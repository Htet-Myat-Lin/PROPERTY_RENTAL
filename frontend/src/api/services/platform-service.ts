import type { ApiResponse } from "@/features/wallet/types";
import type { IPlatformSummary } from "@/features/platform/types";
import { axiosInstance } from "../axios-instance";

const toNumber = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Every money figure arrives from Prisma as a Decimal string.
const toSummary = (raw: IPlatformSummary): IPlatformSummary => ({
  ...raw,
  commissionRate: toNumber(raw.commissionRate),
  revenue: {
    earned: toNumber(raw.revenue.earned),
    held: toNumber(raw.revenue.held),
    forgone: toNumber(raw.revenue.forgone),
  },
  escrow: {
    held: toNumber(raw.escrow.held),
    released: toNumber(raw.escrow.released),
    refunded: toNumber(raw.escrow.refunded),
    landlordPayouts: toNumber(raw.escrow.landlordPayouts),
  },
  obligations: {
    userBalances: toNumber(raw.obligations.userBalances),
    pendingWithdrawals: toNumber(raw.obligations.pendingWithdrawals),
    pendingWithdrawalCount: toNumber(raw.obligations.pendingWithdrawalCount),
  },
  counts: {
    held: toNumber(raw.counts.held),
    released: toNumber(raw.counts.released),
    refunded: toNumber(raw.counts.refunded),
  },
  entries: raw.entries.map((entry) => ({
    ...entry,
    amount: toNumber(entry.amount),
    commissionAmount: toNumber(entry.commissionAmount),
    landlordAmount: toNumber(entry.landlordAmount),
  })),
});

export const PlatformApi = {
  getSummary: async () => {
    const { data } = await axiosInstance.get<ApiResponse<{ summary: IPlatformSummary }>>(
      "/platform/summary"
    );
    return toSummary(data.content.summary);
  },
};
