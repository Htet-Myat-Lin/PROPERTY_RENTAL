export type EscrowStatus = "PENDING" | "RELEASED" | "REFUNDED";

export interface IPlatformEntry {
  id: string;
  amount: number;
  commissionAmount: number;
  landlordAmount: number;
  escrowStatus: EscrowStatus | null;
  createdAt: string;
  property: { id: string; title: string };
  landlord: { id: string; username: string };
}

export interface IPlatformSummary {
  commissionRate: number;
  revenue: {
    earned: number;
    held: number;
    forgone: number;
  };
  escrow: {
    held: number;
    released: number;
    refunded: number;
    landlordPayouts: number;
  };
  obligations: {
    userBalances: number;
    pendingWithdrawals: number;
    pendingWithdrawalCount: number;
  };
  counts: {
    held: number;
    released: number;
    refunded: number;
  };
  entries: IPlatformEntry[];
}

export interface IChartCount {
  label: string;
  count: number;
}

export interface IRevenuePoint {
  month: string;
  revenue: number;
  deposits: number;
}

export interface IPendingRequestItem {
  id: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
  user: { id: string; username: string; email: string };
}

export interface ITopRatedProperty {
  id: string;
  title: string;
  propertyType: string;
  status: string;
  image: string | null;
  averageRating: number;
  reviewCount: number;
}

export interface IAdminDashboard {
  cards: {
    totalUsers: number;
    totalProperties: number;
    activeRentals: number;
    commissionEarned: number;
    escrowHeld: number;
    totalWalletBalance: number;
    pendingDeposits: { count: number; amount: number };
    pendingWithdrawals: { count: number; amount: number };
  };
  revenueOverview: IRevenuePoint[];
  rentRequests: IChartCount[];
  propertyStatus: IChartCount[];
  propertyTypes: IChartCount[];
  usersByRole: IChartCount[];
  platformActivity: {
    pendingVisitBookings: number;
    activeChats: number;
    totalReviews: number;
  };
  pendingDepositRequests: IPendingRequestItem[];
  pendingWithdrawalRequests: IPendingRequestItem[];
  topRatedProperties: ITopRatedProperty[];
}
