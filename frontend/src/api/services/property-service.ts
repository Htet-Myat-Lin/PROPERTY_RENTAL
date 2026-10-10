/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "../axios-instance"

export const PropertyApi = {
    createProperty: async(payload: FormData) => {
        return (await axiosInstance.post("/properties", payload, {
            headers: {"Content-Type": "multipart/form-data"}
        })).data
    },

    getAllProperties: async (filters?: any) => {
        const params = new URLSearchParams()
        if(filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    if (typeof value === 'object') {
                        params.set(key, JSON.stringify(value))
                    } else {
                        params.set(key, value.toString())
                    }
                }
            })
        }

        const queryString = params.toString()
        const endpoint = queryString ? `/properties?${queryString}` : "/properties"

        return (await axiosInstance.get(endpoint)).data
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

    getProperty: async (propertyId: string) => {
        return (await axiosInstance.get(`/properties/${propertyId}`)).data
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
    },

    getRecommendedProperties: async (propertyId: string) => {
        return (await axiosInstance.get(`/properties/${propertyId}/recommend`)).data
    }
}