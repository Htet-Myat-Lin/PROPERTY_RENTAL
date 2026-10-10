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
