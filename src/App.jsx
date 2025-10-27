import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import { MainLayout } from "./layouts/MainLayout";
import { LoginPage } from "./features/auth/components/LoginPage";
import { RegisterPage } from "./features/auth/components/RegisterPage";
import { Dashboard } from "./features/dashboard/Dashboard";
import { JobsList } from "./features/jobs";
import { WebsitesList } from "./features/websites";
import { SubmissionsList } from "./features/submissions";
import { Toaster } from "./components/toaster";



export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<RequireAuth><MainLayout /></RequireAuth>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="jobs" element={<JobsList />} />
            <Route path="websites" element={<WebsitesList />} />
            <Route path="submissions" element={<SubmissionsList />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}
