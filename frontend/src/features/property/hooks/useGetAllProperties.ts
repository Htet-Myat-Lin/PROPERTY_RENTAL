/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyApi } from "@/api/services/property-service";
import { useQuery } from "@tanstack/react-query";

export const useGetAllProperties = (filters?: any) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => PropertyApi.getAllProperties(filters),
  });
};
