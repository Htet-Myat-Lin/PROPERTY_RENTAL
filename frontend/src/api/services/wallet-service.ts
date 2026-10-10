import type {
  ApiResponse,
  DepositRequestFilters,
  IAdminDepositRequest,
  IAdminWithdrawalRequest,
  IDepositRequest,
  IWallet,
  IWalletTransaction,
  IWithdrawalRequest,
  Paginated,
  PaymentMethod,
  PayoutMethod,
  TransactionFilters,
  WithdrawalRequestFilters,
} from "@/features/wallet/types";
import { axiosInstance } from "../axios-instance";

type WithNumeric<T, K extends keyof T> = Omit<T, K> & Record<K, number | string>;

const toNumber = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toWallet = (raw: WithNumeric<IWallet, "balance">): IWallet => ({
  ...raw,
  balance: toNumber(raw.balance),
});

const toDepositRequest = (raw: WithNumeric<IDepositRequest, "amount">): IDepositRequest => ({
  ...raw,
  amount: toNumber(raw.amount),
});

const toAdminDepositRequest = (
  raw: WithNumeric<IAdminDepositRequest, "amount">
): IAdminDepositRequest => ({
  ...raw,
  amount: toNumber(raw.amount),
});

const toTransaction = (
  raw: WithNumeric<IWalletTransaction, "amount" | "balanceAfter">
): IWalletTransaction => ({
  ...raw,
  amount: toNumber(raw.amount),
  balanceAfter: toNumber(raw.balanceAfter),
});

const toWithdrawalRequest = (raw: WithNumeric<IWithdrawalRequest, "amount">): IWithdrawalRequest => ({
  ...raw,
  amount: toNumber(raw.amount),
});

const toAdminWithdrawalRequest = (
  raw: WithNumeric<IAdminWithdrawalRequest, "amount">
): IAdminWithdrawalRequest => ({
  ...raw,
  amount: toNumber(raw.amount),
});

export type DepositPayload = {
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
};

export type WithdrawPayload = {
  amount: number;
  paymentMethod: PayoutMethod;
};

const toQueryParams = (filters: object): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const WalletApi = {
  getMyWallet: async () => {
    const { data } = await axiosInstance.get<ApiResponse<{ wallet: IWallet }>>("/wallet");
    return toWallet(data.content.wallet);
  },

  deposit: async (payload: DepositPayload) => {
    const { data } = await axiosInstance.patch<ApiResponse<{ deposit: IDepositRequest }>>(
      "/wallet/deposit",
      payload
    );
    return toDepositRequest(data.content.deposit);
  },

  getTransactions: async (filters: TransactionFilters = {}): Promise<Paginated<IWalletTransaction>> => {
    const params = toQueryParams(filters);

    const { data } = await axiosInstance.get<
      ApiResponse<{
        walletTransactions: WithNumeric<IWalletTransaction, "amount" | "balanceAfter">[];
        totalPages: number;
        totalCount: number;
      }>
    >(`/wallet/transactions${params}`);

    return {
      items: data.content.walletTransactions.map(toTransaction),
      totalPages: data.content.totalPages,
      totalCount: data.content.totalCount,
    };
  },

  getMyDepositRequests: async (filters: DepositRequestFilters = {}): Promise<Paginated<IDepositRequest>> => {
    const params = toQueryParams(filters);

    const { data } = await axiosInstance.get<
      ApiResponse<{
        depositRequests: WithNumeric<IDepositRequest, "amount">[];
        totalPages: number;
        totalCount: number;
      }>
    >(`/wallet/tenant/deposit-requests${params}`);

    return {
      items: data.content.depositRequests.map(toDepositRequest),
      totalPages: data.content.totalPages,
      totalCount: data.content.totalCount,
    };
  },

  getAllDepositRequests: async (filters: DepositRequestFilters = {}): Promise<Paginated<IAdminDepositRequest>> => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        depositRequests: WithNumeric<IAdminDepositRequest, "amount">[];
        totalPages: number;
        totalCount: number;
      }>
    >(`/wallet/deposit-requests${toQueryParams(filters)}`);

    return {
      items: data.content.depositRequests.map(toAdminDepositRequest),
      totalPages: data.content.totalPages,
      totalCount: data.content.totalCount,
    };
  },

  withdraw: async (payload: WithdrawPayload) => {
    const { data } = await axiosInstance.patch<ApiResponse<{ withdrawal: IWithdrawalRequest }>>(
      "/wallet/withdrawal",
      payload
    );
    return toWithdrawalRequest(data.content.withdrawal);
  },

  getMyWithdrawalRequests: async (
    filters: WithdrawalRequestFilters = {}
  ): Promise<Paginated<IWithdrawalRequest>> => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        withdrawalRequests: WithNumeric<IWithdrawalRequest, "amount">[];
        totalPages: number;
        totalCount: number;
      }>
    >(`/wallet/my/withdrawal-requests${toQueryParams(filters)}`);

    return {
      items: data.content.withdrawalRequests.map(toWithdrawalRequest),
      totalPages: data.content.totalPages,
      totalCount: data.content.totalCount,
    };
  },

  getAllWithdrawalRequests: async (
    filters: WithdrawalRequestFilters = {}
  ): Promise<Paginated<IAdminWithdrawalRequest>> => {
    const { data } = await axiosInstance.get<
      ApiResponse<{
        withdrawalRequests: WithNumeric<IAdminWithdrawalRequest, "amount">[];
        totalPages: number;
        totalCount: number;
      }>
    >(`/wallet/withdrawal-requests${toQueryParams(filters)}`);

    return {
      items: data.content.withdrawalRequests.map(toAdminWithdrawalRequest),
      totalPages: data.content.totalPages,
      totalCount: data.content.totalCount,
    };
  },

  approveWithdrawalRequest: async (id: string) => {
    return (await axiosInstance.patch(`/wallet/withdrawal/${id}/approve`)).data;
  },

  rejectWithdrawalRequest: async (id: string) => {
    return (await axiosInstance.patch(`/wallet/withdrawal/${id}/reject`)).data;
  },

  approveDepositRequest: async (id: string) => {
    return (await axiosInstance.patch(`/wallet/deposit/${id}/approve`)).data;
  },

  rejectDepositRequest: async (id: string) => {
    return (await axiosInstance.patch(`/wallet/deposit/${id}/reject`)).data;
  },
};

