import { BookingApi } from "@/api/services/booking-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookingId, payload }: { bookingId: string; payload: { phoneNumber?: string; schedules?: Record<"date" | "time", string>[] } }) =>
            BookingApi.updateBooking(bookingId, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success("Booking updated successfully");
        },
    });
};