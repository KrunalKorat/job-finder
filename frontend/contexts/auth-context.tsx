"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await api.login({ email, password });
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
      throw err;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setError(null);
    try {
      await api.register({ email, password, name });
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to register. Please check your details.");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignored
    } finally {
      setUser(null);
      router.push("/auth/login");
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
