import { UserApi, type ChangePasswordPayload } from "@/api/services/user-service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => UserApi.changePassword(payload),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
  });
};
