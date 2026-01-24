import { AuthApi } from "@/api/services/auth-service"
import { useMutation } from "@tanstack/react-query"

export const useSendEmailVerifyOTP = () => {
    return useMutation({
        mutationFn: AuthApi.sendVerifyEmailOTP
    })
}