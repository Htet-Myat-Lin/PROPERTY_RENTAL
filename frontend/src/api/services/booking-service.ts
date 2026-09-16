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
    },

    getTenantBookings: async () => {
        return (await axiosInstance.get("/bookings/tenant")).data
    },

    getLandlordBookings: async () => {
        return (await axiosInstance.get("/bookings/landlord")).data
    },

    updateBooking: async (bookingId: string, payload: Partial<BookingRequest>) => {
        return (await axiosInstance.patch(`/bookings/${bookingId}`, payload)).data
    },

    deleteBooking: async (bookingId: string) => {
        return (await axiosInstance.delete(`/bookings/${bookingId}`)).data
    },

    acceptBooking: async (bookingId: string, remarks?: string) => {
        return (await axiosInstance.patch(`/bookings/${bookingId}/accept`, { remarks })).data
    },

    rejectBooking: async (bookingId: string, remarks?: string) => {
        return (await axiosInstance.patch(`/bookings/${bookingId}/reject`, { remarks })).data
    },
}
