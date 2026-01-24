import { AuthApi } from "@/api/services/auth-service"
import { useMutation } from "@tanstack/react-query"

export const useVerifyEmail = () => {
    return useMutation({
        mutationFn: AuthApi.verifyEmail
    })
}