import { BookingApi } from "@/api/services/booking-service";
import { useQuery } from "@tanstack/react-query";

export const useGetBookings = (role?: string) => {
    const isLandlord = role === "LANDLORD";
    return useQuery({
        queryKey: isLandlord ? ["bookings", "landlord"] : ["bookings", "tenant"],
        queryFn: () => isLandlord ? BookingApi.getLandlordBookings() : BookingApi.getTenantBookings(),
    });
};