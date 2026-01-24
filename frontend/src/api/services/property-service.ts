import { axiosInstance } from "../axios-instance"

export const PropertyApi = {
    createProperty: async(payload: FormData) => {
        return (await axiosInstance.post("/properties", payload, {
            headers: {"Content-Type": "multipart/form-data"}
        })).data
    },

    getLandlordProperties: async() => {
        return (await axiosInstance.get("/properties/my-properties")).data
    },

    editProperty: async(propertyId: string, payload: FormData) => {
        return (await axiosInstance.patch(`/properties/${propertyId}`, payload, {
            headers: {"Content-Type": "multipart/form-data"}
        })).data
    },

    deleteProperty: async(propertyId: string) => {
        return (await axiosInstance.delete(`/properties/${propertyId}`)).data
    }
}