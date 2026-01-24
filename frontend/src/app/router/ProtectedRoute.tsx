import { Center, Spinner } from "@chakra-ui/react";
import { useAppStore } from "../store";
import type { Role } from "../types";
import { Header } from "@/components/Header/Header";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles: Role[] }) => {
  const user = useAppStore((s) => s.user);
  const loading = useAppStore((s) => s.loading);

  if (loading) {
    return (
      <>
        <Header />
        <Center minH="95vh">
          <Spinner />
        </Center>
      </>
    );
  }

  if (!user) return <Navigate to="/login-register" />

  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />

  return <Outlet />
};
