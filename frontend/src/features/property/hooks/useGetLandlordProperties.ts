/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyApi } from "@/api/services/property-service"
import { useQuery } from "@tanstack/react-query"

export const useGetLandlordProperties = (filters?: any) => {
    return useQuery({
        queryKey: ["properties", "landlord", filters],
        queryFn: () => PropertyApi.getLandlordProperties(filters)
    })
}