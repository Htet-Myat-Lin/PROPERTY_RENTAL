export type RentRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type EscrowStatus = "PENDING" | "RELEASED" | "REFUNDED";

export interface IRentRequestParty {
  id: string;
  username: string;
  email: string;
  profilePicture?: string | null;
}

export interface IRentRequestProperty {
  id: string;
  title: string;
  baseRentPrice: number;
  status: string;
  locationAddress?: string | null;
}

export interface IEscrow {
  id: string;
  paymentId: string;
  amount: number;
  status: EscrowStatus;
  releaseDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPayment {
  id: string;
  rentRequestId: string;
  amount: number;
  landlordAmount: number;
  commissionAmount: number;
  status: PaymentStatus;
  escrow?: IEscrow | null;
  createdAt: string;
  updatedAt: string;
}

export interface IRentRequest {
  id: string;
  userId: string;
  landlordId: string;
  propertyId: string;
  /** Total rent over the whole lease term. Derived server-side, never client-supplied. */
  amount: number;
  /** Security deposit held in escrow on approval. */
  depositAmount: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
  message?: string | null;
  status: RentRequestStatus;
  decisionReason?: string | null;
  decidedAt?: string | null;
  /** Set once the agreement has been rendered server-side on approval. */
  leaseAgreement?: string | null;
  leaseGeneratedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  property: IRentRequestProperty;
  payments: IPayment[];
  /** Only joined on the landlord list, where the row needs a tenant label. */
  user?: IRentRequestParty;
  landlord?: IRentRequestParty;
}

export interface RentRequestFilters {
  page?: number;
  limit?: number;
  status?: RentRequestStatus;
  propertyId?: string;
  /** Admin only: narrow to requests whose escrow is in a given custody state. */
  escrowStatus?: EscrowStatus;
  /** Admin only: matches property title, tenant, or landlord. */
  search?: string;
}

export interface Paginated<T> {
  items: T[];
  totalPages: number;
  totalCount: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  content: T;
}

export interface RentRequestPayload {
  propertyId: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  message?: string;
}