import type {
  ApiResponse,
  DepositRequestFilters,
  IAdminDepositRequest,
  IDepositRequest,
  IWallet,
  IWalletTransaction,
  Paginated,
  PaymentMethod,
  TransactionFilters,
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

const toDepositRequest = (raw: WithNumeric<IDepositRequest, "ammount">): IDepositRequest => ({
  ...raw,
  ammount: toNumber(raw.ammount),
});

const toAdminDepositRequest = (
  raw: WithNumeric<IAdminDepositRequest, "ammount">
): IAdminDepositRequest => ({
  ...raw,
  ammount: toNumber(raw.ammount),
});

const toTransaction = (
  raw: WithNumeric<IWalletTransaction, "ammount" | "balanceAfter">
): IWalletTransaction => ({
  ...raw,
  ammount: toNumber(raw.ammount),
  balanceAfter: toNumber(raw.balanceAfter),
});

export type DepositPayload = {
  ammount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
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
        walletTransactions: WithNumeric<IWalletTransaction, "ammount" | "balanceAfter">[];
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
        depositRequests: WithNumeric<IDepositRequest, "ammount">[];
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
        depositRequests: WithNumeric<IAdminDepositRequest, "ammount">[];
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

  withdraw: async (payload: { ammount: number; paymentMethod: string }) => {
    return (await axiosInstance.patch("/wallet/withdrawal", payload)).data;
  },

  approveDepositRequest: async (id: string) => {
    return (await axiosInstance.patch(`/wallet/deposit/${id}/approve`)).data;
  },

  rejectDepositRequest: async (id: string) => {
    return (await axiosInstance.patch(`/wallet/deposit/${id}/reject`)).data;
  },
};
