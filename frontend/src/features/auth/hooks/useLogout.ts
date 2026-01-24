import { AuthApi } from "@/api/services/auth-service"
import { useAppStore } from "@/app/store"
import { useMutation } from "@tanstack/react-query"

export const useLogout = () => {
    const setUser = useAppStore((s) => s.setUser)
    return useMutation({
        mutationFn: AuthApi.logout,
        onSuccess: () => setUser(null)
    })
}