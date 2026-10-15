import { AdminUserApi } from "@/api/services/admin-user-service";
import { useQuery } from "@tanstack/react-query";
import type { AdminUserFilters } from "../types";

/** Admin directory of all accounts, driven by URL filters. */
export const useGetAdminUsers = (filters: AdminUserFilters) => {
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: () => AdminUserApi.getUsers(filters),
  });
};