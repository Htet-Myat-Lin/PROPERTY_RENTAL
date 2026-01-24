import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { PropertyListingPage } from "@/pages/PropertyListingPage";
import { TestimonialPage } from "@/pages/TestimonialPage";
import { LoginRegisterPage } from "@/pages/auth/LoginRegisterPage";
import { EmailVerificationPage } from "@/pages/auth/EmailVerificationPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Dashboard as LandlordDashboard } from "@/pages/dashboards/landlord/Dashboard";
import { Dashboard as AdminDashboard } from "@/pages/dashboards/admin/Dashboard";
import {
  LuChrome,
  LuLayoutDashboard,
  LuSettings,
  LuUsers,
} from "react-icons/lu";
import { Properties } from "@/pages/dashboards/landlord/Properties";

const adminNavLinks = [
  { icon: LuLayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: LuChrome, label: "Properties", path: "/admin/properties" },
  { icon: LuUsers, label: "Tenants", path: "/admin/tenants" },
  { icon: LuSettings, label: "Settings", path: "/admin/settings" },
];

const landlordNavLinks = [
  { icon: LuLayoutDashboard, label: "Dashboard", path: "/landlord/dashboard" },
  { icon: LuChrome, label: "Properties", path: "/landlord/properties" },
  { icon: LuUsers, label: "Tenants", path: "/landlord/tenants" },
  { icon: LuSettings, label: "Settings", path: "/landlord/settings" },
];

export const router = createBrowserRouter([
  // Public Routes
  { path: "/", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/properties", element: <PropertyListingPage /> },
  { path: "/testimonial", element: <TestimonialPage /> },
  { path: "/login-register", element: <LoginRegisterPage /> },
  { path: "/verify-email", element: <EmailVerificationPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

  // Admin Routes
  {
    element: <ProtectedRoute allowedRoles={["LANDLORD"]} />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout navLinks={adminNavLinks} />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
        ],
      },
    ],
  },

  // LANDLORD Routes
  {
    element: <ProtectedRoute allowedRoles={["LANDLORD"]} />,
    children: [
      {
        path: "/landlord",
        element: <DashboardLayout navLinks={landlordNavLinks} />,
        children: [
          { path: "dashboard", element: <LandlordDashboard /> },
          { path: "properties", element: <Properties /> }
        ],
      },
    ],
  },

]);
