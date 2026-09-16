import { BookingApi } from "@/api/services/booking-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: BookingApi.deleteBooking,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["bookings"] });
            toast.success("Booking deleted successfully");
        },
    });
};