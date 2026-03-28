import { PropertyApi } from "@/api/services/property-service";
import { useQuery } from "@tanstack/react-query";

export const useGetRecommendedProperties = (propertyId: string) => {
  return useQuery({
    queryKey: ["properties", "recommended"],
    queryFn: () => PropertyApi.getRecommendedProperties(propertyId),
  });
};
