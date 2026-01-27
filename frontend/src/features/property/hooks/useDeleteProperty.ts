import { PropertyApi } from "@/api/services/property-service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useDeleteProperty = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: PropertyApi.deleteProperty,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["properties", "landlord"] })
            toast.success("Property was deleted successfully")
        }
    })
}