import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PropTypes from "prop-types";

// Protected Route Wrapper
const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { isAuthenticated, isLoading, hasVerifiedOTP, user } = useAuth();
  const token = localStorage.getItem("accessToken");

  console.log("ProtectedRoute check:", {
    isAuthenticated,
    hasVerifiedOTP,
    user,
    token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !hasVerifiedOTP || !user) {
    console.log("ProtectedRoute redirecting to login: conditions not met");
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// Public Route Wrapper
const PublicRoute = ({ redirectPath = "/dashboard" }) => {
  const { isAuthenticated, isLoading, hasVerifiedOTP, user } = useAuth();
  const token = localStorage.getItem("accessToken");

  console.log("PublicRoute check:", {
    isAuthenticated,
    hasVerifiedOTP,
    user,
    token,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated && hasVerifiedOTP && user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// Semi-protected Route for OTP and Password Reset flow
const SemiProtectedRoute = ({ emailKey, redirectPath = "/login" }) => {
  const { isLoading } = useAuth();
  const hasEmail = Boolean(localStorage.getItem(emailKey));

  console.log("SemiProtectedRoute check:", {
    emailKey,
    hasEmail,
    isLoading,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return hasEmail ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

// Prop Types
ProtectedRoute.propTypes = {
  redirectPath: PropTypes.string,
};

PublicRoute.propTypes = {
  redirectPath: PropTypes.string,
};

SemiProtectedRoute.propTypes = {
  emailKey: PropTypes.string.isRequired,
  redirectPath: PropTypes.string,
};

export { ProtectedRoute, PublicRoute, SemiProtectedRoute };
