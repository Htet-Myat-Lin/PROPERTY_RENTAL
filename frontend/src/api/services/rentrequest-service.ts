import type {
  ApiResponse,
  IEscrow,
  IPayment,
  IRentRequest,
  Paginated,
  RentRequestFilters,
  RentRequestPayload,
} from "@/features/rentrequest/types";
import { axiosInstance } from "../axios-instance";

/**
 * The API returns `Decimal` columns already normalized to JSON numbers, but a
 * `Float` rent price and a `Decimal` amount can still differ in precision, so
 * money is coerced defensively rather than trusted to stay a number.
 */
type WithNumeric<T, K extends keyof T> = Omit<T, K> & Record<K, number | string>;

const toNumber = (value: unknown): number => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toEscrow = (raw: WithNumeric<IEscrow, "amount">): IEscrow => ({
  ...raw,
  amount: toNumber(raw.amount),
});

const toPayment = (raw: WithNumeric<IPayment, "amount" | "landlordAmount" | "commissionAmount">): IPayment => ({
  ...raw,
  amount: toNumber(raw.amount),
  landlordAmount: toNumber(raw.landlordAmount),
  commissionAmount: toNumber(raw.commissionAmount),
  escrow: raw.escrow ? toEscrow(raw.escrow as WithNumeric<IEscrow, "amount">) : null,
});

const toRentRequest = (
  raw: WithNumeric<IRentRequest, "amount" | "depositAmount">,
): IRentRequest => ({
  ...raw,
  amount: toNumber(raw.amount),
  depositAmount: toNumber(raw.depositAmount),
  payments: (raw.payments ?? []).map((payment) =>
    toPayment(payment as WithNumeric<IPayment, "amount" | "landlordAmount" | "commissionAmount">),
  ),
});

const toQueryParams = (filters: RentRequestFilters): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `?${query}` : "";
};

type ListResponse = {
  rentRequests: WithNumeric<IRentRequest, "amount" | "depositAmount">[];
  totalPages: number;
  totalCount: number;
};

const toPaginated = (data: ApiResponse<ListResponse>): Paginated<IRentRequest> => ({
  items: data.content.rentRequests.map(toRentRequest),
  totalPages: data.content.totalPages,
  totalCount: data.content.totalCount,
});

export const RentRequestApi = {
  create: async (payload: RentRequestPayload): Promise<IRentRequest> => {
    const { data } = await axiosInstance.post<ApiResponse<{ rentRequest: WithNumeric<IRentRequest, "amount" | "depositAmount"> }>>(
      "/rent-requests",
      payload,
    );
    return toRentRequest(data.content.rentRequest);
  },

  getMyRequests: async (filters: RentRequestFilters = {}): Promise<Paginated<IRentRequest>> => {
    const { data } = await axiosInstance.get<ApiResponse<ListResponse>>(
      `/rent-requests/tenant${toQueryParams(filters)}`,
    );
    return toPaginated(data);
  },

  getLandlordRequests: async (filters: RentRequestFilters = {}): Promise<Paginated<IRentRequest>> => {
    const { data } = await axiosInstance.get<ApiResponse<ListResponse>>(
      `/rent-requests/landlord${toQueryParams(filters)}`,
    );
    return toPaginated(data);
  },

  /** Admin only: every landlord's requests, used to drive the escrow queue. */
  getAllRequests: async (filters: RentRequestFilters = {}): Promise<Paginated<IRentRequest>> => {
    const { data } = await axiosInstance.get<ApiResponse<ListResponse>>(
      `/rent-requests${toQueryParams(filters)}`,
    );
    return toPaginated(data);
  },

  /**
   * Fetches the PDF as a blob and saves it. A plain link or `window.open` would
   * not carry the `Authorization` header, so the file is retrieved through the
   * authenticated client and handed to the browser as an object URL.
   */
  downloadLeaseAgreement: async (id: string): Promise<void> => {
    const { data } = await axiosInstance.get<Blob>(`/rent-requests/${id}/lease-agreement`, {
      responseType: "blob",
    });

    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lease-agreement-${id.slice(0, 8)}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoked on the next tick; revoking synchronously can cancel the download
    // in some browsers before it has started reading the blob.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  },

  getById: async (id: string): Promise<IRentRequest> => {
    const { data } = await axiosInstance.get<ApiResponse<{ rentRequest: WithNumeric<IRentRequest, "amount" | "depositAmount"> }>>(
      `/rent-requests/${id}`,
    );
    return toRentRequest(data.content.rentRequest);
  },

  update: async (id: string, payload: RentRequestPayload): Promise<IRentRequest> => {
    const { data } = await axiosInstance.patch<ApiResponse<{ rentRequest: WithNumeric<IRentRequest, "amount" | "depositAmount"> }>>(
      `/rent-requests/${id}`,
      payload,
    );
    return toRentRequest(data.content.rentRequest);
  },

  cancel: async (id: string): Promise<IRentRequest> => {
    const { data } = await axiosInstance.patch<ApiResponse<{ rentRequest: WithNumeric<IRentRequest, "amount" | "depositAmount"> }>>(
      `/rent-requests/${id}/cancel`,
    );
    return toRentRequest(data.content.rentRequest);
  },

  approve: async (id: string, decisionReason?: string): Promise<IRentRequest> => {
    const { data } = await axiosInstance.patch<ApiResponse<{ rentRequest: WithNumeric<IRentRequest, "amount" | "depositAmount"> }>>(
      `/rent-requests/${id}/approve`,
      { decisionReason },
    );
    return toRentRequest(data.content.rentRequest);
  },

  reject: async (id: string, decisionReason?: string): Promise<IRentRequest> => {
    const { data } = await axiosInstance.patch<ApiResponse<{ rentRequest: WithNumeric<IRentRequest, "amount" | "depositAmount"> }>>(
      `/rent-requests/${id}/reject`,
      { decisionReason },
    );
    return toRentRequest(data.content.rentRequest);
  },

  releaseEscrow: async (paymentId: string): Promise<IPayment> => {
    const { data } = await axiosInstance.patch<ApiResponse<{ payment: WithNumeric<IPayment, "amount" | "landlordAmount" | "commissionAmount"> }>>(
      `/rent-requests/escrow/${paymentId}/release`,
    );
    return toPayment(data.content.payment);
  },

  refundEscrow: async (paymentId: string): Promise<IPayment> => {
    const { data } = await axiosInstance.patch<ApiResponse<{ payment: WithNumeric<IPayment, "amount" | "landlordAmount" | "commissionAmount"> }>>(
      `/rent-requests/escrow/${paymentId}/refund`,
    );
    return toPayment(data.content.payment);
  },
};