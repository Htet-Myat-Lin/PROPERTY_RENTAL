export interface ILandlordTenant {
  requestId: string;
  id: string;
  username: string;
  email: string;
  phone: string | null;
  profilePicture: string | null;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string | null;
  monthlyRent: number;
  amount: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
  isActive: boolean;
  requestedAt: string;
}

export interface ILandlordTenantsResult {
  tenants: ILandlordTenant[];
  totalPages: number;
  totalCount: number;
}

export interface LandlordTenantFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const TENANT_STATUS_OPTIONS = [
  { label: "All tenants", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Past", value: "PAST" },
];