export type DepositRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PaymentMethod = "kbz_pay" | "wave_pay" | "bank_transfer" | "credit_card";

export type WalletTransactionType = "DEPOSIT" | "RENT_PAYMENT" | "WITHDRAWAL" | "COMMISSION";

export interface IWallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface IDepositRequest {
  id: string;
  userId: string;
  ammount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: DepositRequestStatus;
  createdAt: string;
  updatedAt: string;
}

/** The admin list joins the owning tenant so the table can label each row. */
export interface IAdminDepositRequest extends IDepositRequest {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface DepositRequestFilters {
  page?: number;
  limit?: number;
  status?: DepositRequestStatus;
  search?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: WalletTransactionType;
}

export interface Paginated<T> {
  items: T[];
  totalPages: number;
  totalCount: number;
}

export interface IWalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  ammount: number;
  balanceAfter: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  content: T;
}
