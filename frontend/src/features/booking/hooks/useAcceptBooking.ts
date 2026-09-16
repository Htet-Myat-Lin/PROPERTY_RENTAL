import { BookingApi } from "@/api/services/booking-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAcceptBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookingId, remarks }: { bookingId: string; remarks?: string }) =>
            BookingApi.acceptBooking(bookingId, remarks),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["bookings", "landlord"] });
            toast.success("Booking accepted successfully");
        },
    });
};