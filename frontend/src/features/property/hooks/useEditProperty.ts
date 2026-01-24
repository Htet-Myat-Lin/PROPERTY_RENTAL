import { PropertyApi } from "@/api/services/property-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useEditProperty = (propertyId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: FormData) => PropertyApi.editProperty(propertyId, payload),
        onSuccess: async() => {
            await queryClient.invalidateQueries({ queryKey: ["properties", "landlord"] })
        }
    })
}