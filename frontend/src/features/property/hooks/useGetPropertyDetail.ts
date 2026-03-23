import { PropertyApi } from "@/api/services/property-service";
import { useQuery } from "@tanstack/react-query";

export const useGetPropertyDetail = (propertyId: string) => {
  return useQuery({
    queryKey: ["properties", propertyId],
    queryFn: () => PropertyApi.getProperty(propertyId),
  });
};
