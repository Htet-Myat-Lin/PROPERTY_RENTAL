import { BookingApi } from "@/api/services/booking-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateBooking = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: BookingApi.createBooking,
        onSuccess: async() => {
            await queryClient.invalidateQueries({ queryKey: ["bookings"] })
        }
    })
}