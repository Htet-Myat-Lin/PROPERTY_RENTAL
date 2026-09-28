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
  LuBell,
  LuCalendarDays,
  LuCalendar,
  LuWallet,
  LuHandCoins,
} from "react-icons/lu";
import { Properties } from "@/pages/dashboards/landlord/Properties";
import { PropertyDetailsPage } from "@/pages/PropertyDetailsPage";
import { IoChatbubblesOutline } from "react-icons/io5";
import { ChatPage } from "@/pages/dashboards/ChatPage";
import { NotificationPage } from "@/pages/dashboards/NotificationPage";
import { Bookings } from "@/pages/dashboards/landlord/Bookings";
import { Bookings as TenantBookings } from "@/pages/dashboards/tenant/Bookings";
import { CalendarPage } from "@/pages/dashboards/landlord/CalendarPage";
import {WalletPage} from "@/pages/dashboards/WalletPage.tsx";
import { DepositRequests as AdminDepositRequests } from "@/pages/dashboards/admin/DepositRequests";

const adminNavLinks = [
  { icon: LuLayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: LuHandCoins, label: "Deposit Requests", path: "/admin/deposit-requests" },
  { icon: LuChrome, label: "Properties", path: "/admin/properties" },
  { icon: LuUsers, label: "Tenants", path: "/admin/tenants" },
  { icon: LuSettings, label: "Settings", path: "/admin/settings" },
];

const landlordNavLinks = [
  { icon: LuLayoutDashboard, label: "Dashboard", path: "/landlord/dashboard" },
  { icon: LuChrome, label: "Properties", path: "/landlord/properties" },
  { icon: LuUsers, label: "Tenants", path: "/landlord/tenants" },
  { icon: LuCalendarDays, label: "Bookings", path: "/landlord/bookings" },
  { icon: IoChatbubblesOutline, label: "Chat", path: "/landlord/chat" },
  { icon: LuBell, label: "Notifications", path: "/landlord/notifications" },
  { icon: LuCalendar, label: "Calendar", path: "/landlord/calendar" },
  { icon: LuWallet, label: "Wallet", path: "/landlord/wallet" },
];

const tenantNavLinks = [
  { icon: LuCalendarDays, label: "Bookings", path: "/tenant/bookings" },
  { icon: IoChatbubblesOutline, label: "Chat", path: "/tenant/chat" },
  { icon: LuBell, label: "Notifications", path: "/tenant/notifications" },
  { icon: LuWallet, label: "Wallet", path: "/tenant/wallet" },
]

export const router = createBrowserRouter([
  // Public Routes
  { path: "/", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/properties", element: <PropertyListingPage /> },
  { path: "/properties/:propertyId", element: <PropertyDetailsPage /> },
  { path: "/testimonial", element: <TestimonialPage /> },
  { path: "/login-register", element: <LoginRegisterPage /> },
  { path: "/verify-email", element: <EmailVerificationPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

  // Admin Routes
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout navLinks={adminNavLinks} />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "deposit-requests", element: <AdminDepositRequests /> },
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
          { path: "properties", element: <Properties /> },
          { path: "chat", element: <ChatPage /> },
          { path: "notifications", element: <NotificationPage /> },
          { path: "bookings", element: <Bookings /> },
          { path: "calendar", element: <CalendarPage /> },
          { path: "wallet", element: <WalletPage /> },
        ],
      },
    ],
  },

  // TENANT Routes
  {
    element: <ProtectedRoute allowedRoles={["TENANT"]} />,
    children: [
      {
        path: "/tenant",
        element: <DashboardLayout navLinks={tenantNavLinks} />,
        children: [
          {  path: "bookings", element: <TenantBookings /> },
          {  path: "chat", element: <ChatPage /> },
          { path: "notifications", element: <NotificationPage /> },
          { path: "wallet", element: <WalletPage /> },
        ]
       }
    ]
  }

]);
