import { AuthApi } from "@/api/services/auth-service"
import { useMutation } from "@tanstack/react-query"

export const useSendResetPasswordOTP = () => {
    return useMutation({
        mutationFn: AuthApi.sendResetPasswordOTP
    })
}