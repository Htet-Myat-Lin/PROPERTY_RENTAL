export interface IBookingUser {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
}

export interface IBookingProperty {
    id: string;
    title: string;
    description: string;
    baseRentPrice: number;
    beds: number;
    baths: number;
    propertyType: string;
    status: string;
    locationAddress?: string;
    images: string[];
}

export interface IBookingSchedule {
    date: string;
    time: string;
}

export type BookingStatus = "PENDING" | "ACCEPT" | "REJECT";

export interface IBooking {
    id: string;
    landlordId: string;
    tenantId: string;
    propertyId: string;
    phoneNumber: string;
    schedules: IBookingSchedule[];
    status: BookingStatus;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
    property: IBookingProperty;
    tenant: IBookingUser;
    landlord: IBookingUser;
}
