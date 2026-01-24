import { AuthApi } from "@/api/services/auth-service"
import { useAppStore } from "@/app/store"
import { useMutation } from "@tanstack/react-query"

export const useRegister = () =>{
    const setUser = useAppStore((state) => state.setUser)
    const setAccessToken = useAppStore((state) => state.setAccessToken)
    return useMutation({
        mutationFn: AuthApi.register,
        onSuccess: (data) => {
            setUser(data.user)
            setAccessToken(data.accessToken)
        }
    })
}