import { PropertyApi } from "@/api/services/property-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateProperty = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: PropertyApi.createProperty,
        onSuccess: async() => {
            await queryClient.invalidateQueries({ queryKey: ["properties", "landlord"] })
        }
    })
}