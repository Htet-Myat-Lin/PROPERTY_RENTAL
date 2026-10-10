import { UserApi } from "@/api/services/user-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useProfilePicture = () => {
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: (file: File) => UserApi.uploadProfilePicture(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile picture updated");
    },
  });

  const remove = useMutation({
    mutationFn: () => UserApi.removeProfilePicture(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile picture removed");
    },
  });

  return { upload, remove };
};
