import type { User } from "@/routes/types";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    console.log("Logging in with", email, password);
    // Simulated login logic
    setUser({ email } as User); // cast for now — replace with real logic
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async () => {
    console.log("Logging out");
    setUser(null);
    setIsAuthenticated(false);
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
