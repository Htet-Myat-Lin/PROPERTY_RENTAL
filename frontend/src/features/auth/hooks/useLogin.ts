import { AuthApi } from "@/api/services/auth-service"
import { useAppStore } from "@/app/store"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {
    const setAccessToken = useAppStore((state) => state.setAccessToken)
    const setUser = useAppStore((state) => state.setUser)

    return useMutation({
        mutationFn: AuthApi.login,
        onSuccess: (data) => {
            setAccessToken(data.accessToken)
            setUser(data.content.user)
        },
        onError: (err) => console.error(err)
    })
}