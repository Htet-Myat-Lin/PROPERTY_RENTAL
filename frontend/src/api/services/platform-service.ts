import type { ApiResponse } from "@/features/wallet/types";
import type { IAdminDashboard, IPlatformSummary } from "@/features/platform/types";
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

const toPendingRequest = (raw: IAdminDashboard["pendingDepositRequests"][number]) => ({
  ...raw,
  amount: toNumber(raw.amount),
});

const toDashboard = (raw: IAdminDashboard): IAdminDashboard => ({
  cards: {
    totalUsers: toNumber(raw.cards.totalUsers),
    totalProperties: toNumber(raw.cards.totalProperties),
    activeRentals: toNumber(raw.cards.activeRentals),
    commissionEarned: toNumber(raw.cards.commissionEarned),
    escrowHeld: toNumber(raw.cards.escrowHeld),
    totalWalletBalance: toNumber(raw.cards.totalWalletBalance),
    pendingDeposits: {
      count: toNumber(raw.cards.pendingDeposits.count),
      amount: toNumber(raw.cards.pendingDeposits.amount),
    },
    pendingWithdrawals: {
      count: toNumber(raw.cards.pendingWithdrawals.count),
      amount: toNumber(raw.cards.pendingWithdrawals.amount),
    },
  },
  revenueOverview: raw.revenueOverview.map((point) => ({
    month: point.month,
    revenue: toNumber(point.revenue),
    deposits: toNumber(point.deposits),
  })),
  rentRequests: raw.rentRequests.map((item) => ({ label: item.label, count: toNumber(item.count) })),
  propertyStatus: raw.propertyStatus.map((item) => ({ label: item.label, count: toNumber(item.count) })),
  propertyTypes: raw.propertyTypes.map((item) => ({ label: item.label, count: toNumber(item.count) })),
  usersByRole: raw.usersByRole.map((item) => ({ label: item.label, count: toNumber(item.count) })),
  platformActivity: {
    pendingVisitBookings: toNumber(raw.platformActivity.pendingVisitBookings),
    activeChats: toNumber(raw.platformActivity.activeChats),
    totalReviews: toNumber(raw.platformActivity.totalReviews),
  },
  pendingDepositRequests: raw.pendingDepositRequests.map(toPendingRequest),
  pendingWithdrawalRequests: raw.pendingWithdrawalRequests.map(toPendingRequest),
  topRatedProperties: raw.topRatedProperties.map((property) => ({
    ...property,
    averageRating: toNumber(property.averageRating),
    reviewCount: toNumber(property.reviewCount),
  })),
});

export const PlatformApi = {
  getSummary: async () => {
    const { data } = await axiosInstance.get<ApiResponse<{ summary: IPlatformSummary }>>(
      "/platform/summary"
    );
    return toSummary(data.content.summary);
  },
  getDashboard: async () => {
    const { data } = await axiosInstance.get<ApiResponse<{ dashboard: IAdminDashboard }>>(
      "/platform/dashboard"
    );
    return toDashboard(data.content.dashboard);
  },
};
