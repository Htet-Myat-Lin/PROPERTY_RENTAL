import { AuthApi } from "@/api/services/auth-service"
import { useMutation } from "@tanstack/react-query"

export const useForgotPassowrd = () => {
    return useMutation({
        mutationFn: AuthApi.forgotPassword
    })
}