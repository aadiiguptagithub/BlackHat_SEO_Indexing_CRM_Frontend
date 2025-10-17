import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { authAPI } from "@/services/api/auth";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasVerifiedOTP, setHasVerifiedOTP] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication status on initial load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const user_id = localStorage.getItem("user_id");
    const userEmail = localStorage.getItem("userEmail");

    console.log("AuthContext init - localStorage:", {
      token,
      storedUser,
      user_id,
      userEmail,
    });

    try {
      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setHasVerifiedOTP(true);
      } else if (user_id && userEmail) {
        setUser({ email: userEmail, id: user_id });
        setIsAuthenticated(true);
        setHasVerifiedOTP(false);
      } else {
        setIsAuthenticated(false);
        setHasVerifiedOTP(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      localStorage.removeItem("userEmail");
      setIsAuthenticated(false);
      setHasVerifiedOTP(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);

      if (response.status === 200 || response.success === true) {
        // Store initial auth data
        localStorage.setItem("user_id", response.data.user_id.toString());
        localStorage.setItem("userEmail", credentials.email);

        // Update state
        const newUser = { email: credentials.email, id: response.data.user_id };
        setUser(newUser);
        setIsAuthenticated(true);
        setHasVerifiedOTP(false);

        console.log("Login - localStorage updated:", {
          user_id: localStorage.getItem("user_id"),
          userEmail: localStorage.getItem("userEmail"),
        });

        navigate("/verify-otp");
        return response;
      }
      throw new Error(response.message || "Login failed");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyOTP = async (otp) => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) throw new Error("No user ID found");

      const response = await authAPI.verifyOTP({
        user_id: user_id,
        otp: otp,
      });

      if (response.success || response.status === 200) {
        // Store auth data
        // Use user.id as a fallback token if backend doesn't provide one
        const token = response.data?.token || `user-${user_id}`;
        localStorage.setItem("accessToken", token);

        // Use backend-provided user if available, else fallback to current user
        const finalUser = response.data?.user ||
          user || { email: localStorage.getItem("userEmail"), id: user_id };
        localStorage.setItem("user", JSON.stringify(finalUser));
        setUser(finalUser);

        // Clear OTP-related data
        localStorage.removeItem("user_id");
        localStorage.removeItem("userEmail");

        // Update state
        setHasVerifiedOTP(true);
        setIsAuthenticated(true);

        console.log("verifyOTP - localStorage updated:", {
          accessToken: localStorage.getItem("accessToken"),
          user: localStorage.getItem("user"),
        });

        navigate("/dashboard");
        return response;
      }
      throw new Error(response.message || "OTP verification failed");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Invalid OTP",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resendOTP = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) throw new Error("No user ID found");

      const response = await authAPI.resendOTP({ user_id });
      toast({
        title: "Success",
        description: "New OTP has been sent to your email",
        variant: "success",
      });
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP",
        variant: "destructive",
      });
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        localStorage.setItem("resetUserId", response.data.user_id);
        localStorage.setItem("resetEmail", email);
        navigate("/forgot-password/verify");
        toast({
          title: "Success",
          description: "Reset code has been sent to your email.",
          variant: "success",
        });
        return response;
      }
      throw new Error(response.message || "Failed to send reset code");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyResetOTP = async (otp) => {
    try {
      const user_id = localStorage.getItem("resetUserId");
      if (!user_id) throw new Error("No user ID found");

      const response = await authAPI.verifyPasswordOTP({
        user_id: user_id,
        otp: otp,
      });

      if (response.success || response.status === 200) {
        localStorage.setItem("resetOTP", otp);
        navigate("/forgot-password/reset");
        toast({
          title: "Success",
          description: "Code verified successfully!",
          variant: "success",
        });
        return response;
      }
      throw new Error(response.message || "OTP verification failed");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Invalid code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resendResetOTP = async () => {
    try {
      const user_id = localStorage.getItem("resetUserId");
      if (!user_id) throw new Error("No user ID found");

      const response = await authAPI.resendOTP({ user_id });
      toast({
        title: "Success",
        description: "New code has been sent to your email",
        variant: "success",
      });
      return response;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (user_id, otp, password) => {
    try {
      const response = await authAPI.resetPassword({
        user_id,
        otp,
        password,
      });
      if (response.success) {
        return response;
      }
      throw new Error(response.message || "Failed to reset password");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      setHasVerifiedOTP(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    hasVerifiedOTP,
    login,
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetOTP,
    resendResetOTP,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
