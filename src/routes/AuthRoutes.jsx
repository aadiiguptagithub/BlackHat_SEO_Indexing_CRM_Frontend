import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, PublicRoute, SemiProtectedRoute } from "./RouteGuards";
import LoginPage from "@/features/auth/components/LoginPage";
import OTPVerification from "@/features/auth/components/OTPVerification";
import ForgotPasswordEmail from "@/features/auth/components/ForgotPasswordEmail";
import ForgotPasswordOTP from "@/features/auth/components/ForgotPasswordOTP";
import PasswordResetForm from "@/features/auth/components/PasswordResetForm";
import Dashboard from "@/features/dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordEmail />,
      },
    ],
  },
  {
    element: <SemiProtectedRoute emailKey="temp_email" />,
    children: [
      {
        path: "/otp",
        element: <OTPVerification />,
      },
    ],
  },
  {
    element: (
      <SemiProtectedRoute
        emailKey="resetEmail"
        redirectPath="/forgot-password"
      />
    ),
    children: [
      {
        path: "/forgot-password/verify",
        element: <ForgotPasswordOTP />,
      },
      {
        path: "/forgot-password/reset",
        element: <PasswordResetForm />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
