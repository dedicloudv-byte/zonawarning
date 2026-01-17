"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthCredentials {
  email: string;
  apiToken: string;
  accountId: string;
}

interface AuthContextType {
  credentials: AuthCredentials | null;
  login: (creds: AuthCredentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [credentials, setCredentials] = useState<AuthCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage on mount
    const stored = localStorage.getItem("zw_auth");
    if (stored) {
      try {
        setCredentials(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse auth", e);
        localStorage.removeItem("zw_auth");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (creds: AuthCredentials) => {
    setCredentials(creds);
    localStorage.setItem("zw_auth", JSON.stringify(creds));
    router.push("/dashboard");
  };

  const logout = () => {
    setCredentials(null);
    localStorage.removeItem("zw_auth");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        credentials,
        login,
        logout,
        isAuthenticated: !!credentials,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
