// File: src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, hasVerifiedOTP, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !localStorage.getItem("accessToken")) {
    return <Navigate to="/login" replace />;
  }

  if (!hasVerifiedOTP) {
    return <Navigate to="/verify-otp" replace />;
  }

  return <Outlet />;
};
