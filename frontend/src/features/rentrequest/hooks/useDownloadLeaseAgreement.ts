import { RentRequestApi } from "@/api/services/rentrequest-service";
import { getApiErrorMessage } from "@/utils/api-error";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * Downloads the lease PDF. The server renders it on approval and regenerates it
 * on demand if the stored file is missing, so this only needs a success toast.
 */
export const useDownloadLeaseAgreement = () => {
  return useMutation({
    mutationFn: (rentRequestId: string) => RentRequestApi.downloadLeaseAgreement(rentRequestId),
    onSuccess: () => {
      toast.success("Lease agreement downloaded");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "Could not download the lease agreement"));
    },
  });
};
