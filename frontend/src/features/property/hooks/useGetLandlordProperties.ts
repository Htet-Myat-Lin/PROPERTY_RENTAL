import { PropertyApi } from "@/api/services/property-service"
import { useQuery } from "@tanstack/react-query"

export const useGetLandlordProperties = () => {
    return useQuery({
        queryKey: ["properties", "landlord"],
        queryFn: PropertyApi.getLandlordProperties
    })
}