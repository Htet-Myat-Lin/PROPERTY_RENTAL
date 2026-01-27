/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "../axios-instance"

export const PropertyApi = {
    createProperty: async(payload: FormData) => {
        return (await axiosInstance.post("/properties", payload, {
            headers: {"Content-Type": "multipart/form-data"}
        })).data
    },

    getLandlordProperties: async(filters?: any) => {
        const params = new URLSearchParams()
        if(filters) {
            if(filters.search) params.set("search", filters.search)
            if(filters.sortBy) params.set("sortBy", filters.sortBy)
            if(filters.page) params.set("page", filters.page.toString())
            if(filters.limit) params.set("limit", filters.limit.toString())
            if(filters.status) params.set("status", filters.status)
        }

        const queryString = params.toString()
        const endpoint = queryString ? `/properties/my-properties?${queryString}` : "/properties/my-properties"

        return (await axiosInstance.get(endpoint)).data
    },

    editProperty: async(propertyId: string, payload: FormData) => {
        return (await axiosInstance.patch(`/properties/${propertyId}`, payload, {
            headers: {"Content-Type": "multipart/form-data"}
        })).data
    },

    deleteProperty: async(propertyId: string) => {
        return (await axiosInstance.delete(`/properties/${propertyId}`)).data
    },

    deleteProperties: async(ids: string[]) => {
         return (await axiosInstance.delete("/properties", { data: { ids } })).data
    }
}