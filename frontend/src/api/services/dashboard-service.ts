import type { ApiResponse } from "@/features/wallet/types";
import type { ILandlordDashboard, ITenantDashboard } from "@/features/dashboard/types";
import { axiosInstance } from "../axios-instance";

const toNumber = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Every money figure arrives from Prisma as a Decimal string, so each response is
// normalised the same way the platform summary is.
const toLandlordDashboard = (raw: ILandlordDashboard): ILandlordDashboard => ({
  ...raw,
  cards: {
    totalProperties: toNumber(raw.cards.totalProperties),
    activeTenants: toNumber(raw.cards.activeTenants),
    netEarnings: toNumber(raw.cards.netEarnings),
    pendingRequests: toNumber(raw.cards.pendingRequests),
  },
  wallet: {
    balance: toNumber(raw.wallet.balance),
    escrowHeld: toNumber(raw.wallet.escrowHeld),
  },
  earnings: {
    total: toNumber(raw.earnings.total),
    thisMonth: toNumber(raw.earnings.thisMonth),
    series: raw.earnings.series.map((point) => ({
      month: point.month,
      amount: toNumber(point.amount),
    })),
  },
  occupancy: raw.occupancy.map((item) => ({ label: item.label, count: toNumber(item.count) })),
  pendingRentRequests: raw.pendingRentRequests.map((request) => ({
    ...request,
    amount: toNumber(request.amount),
    depositAmount: toNumber(request.depositAmount),
    property: { ...request.property, baseRentPrice: toNumber(request.property.baseRentPrice) },
  })),
  withdrawals: raw.withdrawals.map((withdrawal) => ({
    ...withdrawal,
    amount: toNumber(withdrawal.amount),
  })),
});

const toTenantDashboard = (raw: ITenantDashboard): ITenantDashboard => ({
  ...raw,
  cards: {
    nextRentDue: raw.cards.nextRentDue
      ? { amount: toNumber(raw.cards.nextRentDue.amount), dueDate: raw.cards.nextRentDue.dueDate }
      : null,
    wishlistCount: toNumber(raw.cards.wishlistCount),
    walletBalance: toNumber(raw.cards.walletBalance),
    activeRequests: toNumber(raw.cards.activeRequests),
  },
  rental: raw.rental
    ? {
        ...raw.rental,
        monthlyRent: toNumber(raw.rental.monthlyRent),
        depositAmount: toNumber(raw.rental.depositAmount),
        amount: toNumber(raw.rental.amount),
      }
    : null,
  spending: {
    totalSpent: toNumber(raw.spending.totalSpent),
    reviewCount: toNumber(raw.spending.reviewCount),
  },
  wishlist: raw.wishlist.map((item) => ({ ...item, baseRentPrice: toNumber(item.baseRentPrice) })),
  rentRequests: raw.rentRequests.map((request) => ({
    ...request,
    amount: toNumber(request.amount),
    depositAmount: toNumber(request.depositAmount),
  })),
});

export const DashboardApi = {
  getLandlordDashboard: async (): Promise<ILandlordDashboard> => {
    const { data } = await axiosInstance.get<ApiResponse<{ dashboard: ILandlordDashboard }>>(
      "/dashboard/landlord"
    );
    return toLandlordDashboard(data.content.dashboard);
  },

  getTenantDashboard: async (): Promise<ITenantDashboard> => {
    const { data } = await axiosInstance.get<ApiResponse<{ dashboard: ITenantDashboard }>>(
      "/dashboard/tenant"
    );
    return toTenantDashboard(data.content.dashboard);
  },
};
