export interface ICountItem {
  label: string;
  count: number;
}

export interface IEarningsPoint {
  month: string;
  amount: number;
}

export interface ILandlordContact {
  id: string;
  username: string;
  profilePicture: string | null;
}

export interface ILandlordPendingRentRequest {
  id: string;
  amount: number;
  depositAmount: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
  createdAt: string;
  tenant: ILandlordContact;
  property: { id: string; title: string; baseRentPrice: number; image: string | null };
}

export interface ILandlordVisitBooking {
  id: string;
  phoneNumber: string;
  schedules: Record<string, string>[];
  createdAt: string;
  tenant: ILandlordContact;
  property: { id: string; title: string; image: string | null };
}

export interface ILandlordWithdrawal {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export interface ILandlordDashboard {
  cards: {
    totalProperties: number;
    activeTenants: number;
    netEarnings: number;
    pendingRequests: number;
  };
  wallet: {
    balance: number;
    escrowHeld: number;
  };
  earnings: {
    total: number;
    thisMonth: number;
    series: IEarningsPoint[];
  };
  occupancy: ICountItem[];
  pendingRentRequests: ILandlordPendingRentRequest[];
  pendingVisitBookings: ILandlordVisitBooking[];
  withdrawals: ILandlordWithdrawal[];
}

export interface INextRentDue {
  amount: number;
  dueDate: string;
}

export interface ITenantRental {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string | null;
  locationAddress: string | null;
  landlord: ILandlordContact;
  monthlyRent: number;
  depositAmount: number;
  amount: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
  progress: number;
  hasLease: boolean;
}

export interface ITenantWishlistItem {
  id: string;
  propertyId: string;
  title: string;
  propertyType: string;
  status: string;
  baseRentPrice: number;
  image: string | null;
  locationAddress: string | null;
}

export interface ITenantVisitBooking {
  id: string;
  status: string;
  phoneNumber: string;
  schedules: Record<string, string>[];
  createdAt: string;
  landlord: ILandlordContact;
  property: { id: string; title: string; image: string | null };
}

export interface ITenantRentRequest {
  id: string;
  status: string;
  amount: number;
  depositAmount: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
  createdAt: string;
  property: { id: string; title: string; image: string | null };
}

export interface ITenantDashboard {
  cards: {
    nextRentDue: INextRentDue | null;
    wishlistCount: number;
    walletBalance: number;
    activeRequests: number;
  };
  rental: ITenantRental | null;
  spending: {
    totalSpent: number;
    reviewCount: number;
  };
  wishlist: ITenantWishlistItem[];
  visitBookings: ITenantVisitBooking[];
  rentRequests: ITenantRentRequest[];
}
