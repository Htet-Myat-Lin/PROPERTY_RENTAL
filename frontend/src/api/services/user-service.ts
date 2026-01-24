import { axiosInstance } from "../axios-instance";

export const UserApi = {
    getMe: async() => {
        const { data } = await axiosInstance.get("/users/me")
        return data
    },
}