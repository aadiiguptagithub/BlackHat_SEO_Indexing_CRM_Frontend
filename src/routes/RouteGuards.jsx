import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PropTypes from "prop-types";

// Protected Route Wrapper
const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

// Public Route Wrapper
const PublicRoute = ({ redirectPath = "/dashboard" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

// Semi-protected Route for OTP and Password Reset flow
const SemiProtectedRoute = ({ emailKey, redirectPath = "/login" }) => {
  const { isLoading } = useAuth();
  const hasEmail = Boolean(localStorage.getItem(emailKey));

  if (isLoading) {
    return null; // Or a loading spinner
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
