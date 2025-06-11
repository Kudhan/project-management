import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { publicRoutes } from "@/lib";
import { queryClient } from "./react-query-provider";
import type { User } from "@/routes/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { user: User; token: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // start loading by default

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isPublicRoute = publicRoutes.includes(currentPath);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = localStorage.getItem("user");

        if (userInfo) {
          setUser(JSON.parse(userInfo));
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);

          if (!isPublicRoute) {
            navigate("/sign-in");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [currentPath, navigate, isPublicRoute]);

  useEffect(()=>{
    const handleLogout=()=>{
      logout();
      navigate("/sign-in");
    };

    window.addEventListener("forceLogout",handleLogout);
    return ()=> window.removeEventListener("forceLogout",handleLogout);
  },[]);

  const login = async (data: { user: User; token: string }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
    navigate("/sign-in");
  };

  const values: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
