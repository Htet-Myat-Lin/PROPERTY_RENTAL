export interface IAdminPropertyLandlord {
  id: string;
  username: string;
  email: string;
  profilePicture: string | null;
}

export interface IAdminProperty {
  id: string;
  title: string;
  baseRentPrice: number;
  beds: number | null;
  baths: number | null;
  area: number | null;
  propertyType: string;
  status: string;
  locationAddress: string | null;
  images: string[];
  availableDate: string | null;
  createdAt: string;
  updatedAt: string;
  landlord: IAdminPropertyLandlord;
  rating: number | null;
  reviewCount: number;
  openRequests: number;
}

export interface IAdminPropertiesResult {
  properties: IAdminProperty[];
  totalPages: number;
  totalCount: number;
}

export interface AdminPropertyFilters {
  search?: string;
  status?: string;
  propertyType?: string;
  page?: number;
  limit?: number;
}

export const PROPERTY_STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Rented", value: "RENTED" },
  { label: "Reserved", value: "RESERVED" },
];

export const PROPERTY_TYPE_OPTIONS = [
  { label: "All types", value: "" },
  { label: "Apartment", value: "Apartment" },
  { label: "House", value: "House" },
  { label: "Condo", value: "Condo" },
  { label: "Villa", value: "Villa" },
];