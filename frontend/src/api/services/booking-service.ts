import { axiosInstance } from "../axios-instance";

type BookingRequest = {
    landlordId: string;
    tenantId: string;
    propertyId: string;
    phoneNumber: string;
    schedules: Record<"date" | "time", string>[];
}

export const BookingApi = {
    createBooking: async (payload: BookingRequest) => {
        return (await axiosInstance.post("/bookings", payload)).data
    }
}