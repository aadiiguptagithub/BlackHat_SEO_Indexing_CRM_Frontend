// File: src/components/auth/PublicRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PropTypes from "prop-types";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, hasVerifiedOTP } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Determine the redirect based on auth state and current location
  const shouldRedirect = () => {
    if (!isAuthenticated) {
      return location.pathname === "/verify-otp" ? "/login" : null;
    }

    if (hasVerifiedOTP) {
      return "/dashboard";
    }

    if (location.pathname === "/login") {
      return "/verify-otp";
    }

    return null;
  };

  const redirect = shouldRedirect();
  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return children || <Outlet />;
};

PublicRoute.propTypes = {
  children: PropTypes.node,
};
