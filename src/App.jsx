import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import {
  ProtectedRoute,
  PublicRoute,
  SemiProtectedRoute,
} from "./components/auth/RouteGuards";
import { MainLayoutWithBankProvider } from "./layouts/MainLayoutWithBankProvider";
import { MasterRoutes } from "./features/master";
import { LoginPage } from "./features/auth/components/LoginPage";
import { OTPVerification } from "./features/auth/components/OTPVerification";
import { ForgotPasswordEmail } from "./features/auth/components/ForgotPasswordEmail";
import { ForgotPasswordOTP } from "./features/auth/components/ForgotPasswordOTP";
import { PasswordResetForm } from "./features/auth/components/PasswordResetForm";
import { ReportRoutes } from "./features/reports";
import { Dashboard } from "./features/dashboard/Dashboard";

import { IPSettings } from "./features/settings/components/IPSettings";
import { MediaSettings } from "./features/settings/components/MediaSettings";
import { ManageBank } from "./features/settings/components/ManageBank";
import { OrderProvider } from "./features/master/context/OrderContext"; // Import OrderProvider
import { Users } from "./features/users/components/Users";
import { Profile } from "./features/profile/components/Profile";
import { TripManagement } from "./features/trips/TripManagement";
import { FuelManagement } from "./features/fuel";
import { ToastContainer } from "./lib/ToastContainer";

// Placeholder component for routes that haven't been implemented yet
const PlaceholderPage = ({ title }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{title}</h1>
      <p className="text-gray-600 text-lg">This page is under development.</p>
      <div className="mt-6">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Coming Soon
        </div>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          />
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public Routes */}
            {/* <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/forgot-password"
                element={<ForgotPasswordEmail />}
              />
            </Route> */}

            {/* Semi-Protected OTP Route */}
            {/* <Route
              element={
                <SemiProtectedRoute
                  emailKey="userEmail"
                  redirectPath="/login"
                />
              }
            >
              <Route path="/verify-otp" element={<OTPVerification />} />
            </Route> */}

            {/* Semi-Protected Forgot Password Routes */}
            {/* <Route
              element={
                <SemiProtectedRoute
                  emailKey="resetEmail"
                  redirectPath="/forgot-password"
                />
              }
            >
              <Route
                path="/forgot-password/verify"
                element={<ForgotPasswordOTP />}
              />
              <Route
                path="/forgot-password/reset"
                element={<PasswordResetForm />}
              />
            </Route> */}

            {/* Protected Routes */}
            {/* <Route element={<ProtectedRoute />}> */}
              <Route element={<MainLayoutWithBankProvider />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Navigate to="/trips" replace />} />
                <Route path="/trips" element={<TripManagement />} />
                <Route path="/master/*" element={<MasterRoutes />} />
                <Route path="/fuel" element={<FuelManagement />} />
                <Route path="/reports/*" element={<ReportRoutes />} />
                <Route path="/users" element={<Users />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings">
                  <Route
                    index
                    element={<PlaceholderPage title="Settings Overview" />}
                  />
                  <Route path="ip" element={<IPSettings />} />
                  <Route path="media" element={<MediaSettings />} />
                  <Route path="bank" element={<ManageBank />} />
                </Route>
                <Route
                  path="*"
                  element={
                    <div className="container mx-auto px-4 py-8">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <h1 className="text-3xl font-bold mb-4 text-red-600">
                          404 - Page Not Found
                        </h1>
                        <p className="text-gray-600 text-lg mb-6">
                          The page you're looking for doesn't exist.
                        </p>
                        <button
                          onClick={() => window.history.back()}
                          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                          </svg>
                          Go Back
                        </button>
                      </div>
                    </div>
                  }
                />
              </Route>
            {/* </Route> */}
          </Routes>
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
