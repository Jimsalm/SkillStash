import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, type AuthResponse, type LoginInput, type RegisterInput } from "@/api/authApi";
import { toast } from "sonner";

interface AuthContextType {
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  loginAction: (data: LoginInput) => Promise<void>;
  registerAction: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginAction = async (data: LoginInput) => {
    try {
      const res = await login(data);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        toast.success("Logged in successfully!");
        navigate("/"); 
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || error.response?.data?.error || "Login failed";
      toast.error(errorMsg);
    }
  };

  const registerAction = async (data: RegisterInput) => {
    try {
      const res = await register(data);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        toast.success("Account created successfully!");
        navigate("/"); 
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || error.response?.data?.error || "Registration failed";
      toast.error(errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/auth/login");
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginAction, registerAction, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};