import { axiosInstance } from "../axios-instance";

export interface UpdateProfilePayload {
    username: string;
    phone: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export const UserApi = {
    getMe: async() => {
        const { data } = await axiosInstance.get("/users/me")
        return data
    },
    updateProfile: async(payload: UpdateProfilePayload) => {
        const { data } = await axiosInstance.patch("/users/me", payload)
        return data
    },
    changePassword: async(payload: ChangePasswordPayload) => {
        const { data } = await axiosInstance.patch("/users/me/password", payload)
        return data
    },
    uploadProfilePicture: async(file: File) => {
        const formData = new FormData()
        formData.append("profileImage", file)
        const { data } = await axiosInstance.post("/users/me/profile-picture", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        return data
    },
    removeProfilePicture: async() => {
        const { data } = await axiosInstance.delete("/users/me/profile-picture")
        return data
    },
}
