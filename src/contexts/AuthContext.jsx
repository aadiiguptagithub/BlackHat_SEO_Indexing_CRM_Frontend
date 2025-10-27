import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication status on initial load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const apiKey = localStorage.getItem("apiKey");

    try {
      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else if (apiKey) {
        // Worker API key authentication
        setUser({ type: 'worker', apiKey });
        setIsAuthenticated(true);
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setAuth = (token, userData = null) => {
    localStorage.setItem("accessToken", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("apiKey");
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.success) {
        const { token, user } = response.data;
        setAuth(token, user);
        navigate("/dashboard");
        
        toast({
          title: "Success",
          description: "Login successful!",
          variant: "default",
        });
        
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

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.success) {
        const { token, user } = response.data;
        setAuth(token, user);
        navigate("/dashboard");
        
        toast({
          title: "Success",
          description: "Registration successful!",
          variant: "default",
        });
        
        return response;
      }
      throw new Error(response.message || "Registration failed");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithApiKey = async (apiKey) => {
    try {
      localStorage.setItem("apiKey", apiKey);
      setUser({ type: 'worker', apiKey });
      setIsAuthenticated(true);
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid API key",
        variant: "destructive",
      });
      throw error;
    }
  };



  const logout = async () => {
    try {
      clearAuth();
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

  const fetchWithAuth = async (url, options = {}) => {
    try {
      return await api(url, options);
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuth();
        navigate("/login");
      }
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    loginWithApiKey,
    logout,
    setAuth,
    clearAuth,
    fetchWithAuth,
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
