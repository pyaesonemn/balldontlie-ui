"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  AuthState,
  defaultAuthState,
  getAuthState,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
} from "./auth";

// Create Auth Context
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<User | null>;
  register: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const state = getAuthState();
    setAuthState(state);
    setLoading(false);
  }, []);

  // Login function
  const login = async (
    username: string,
    password: string
  ): Promise<User | null> => {
    const user = authLogin(username, password);
    if (user) {
      setAuthState({ user, isAuthenticated: true });
    }
    return user;
  };

  // Register function
  const register = async (
    username: string,
    password: string
  ): Promise<User | null> => {
    const user = authRegister(username, password);
    if (user) {
      setAuthState({ user, isAuthenticated: true });
    }
    return user;
  };

  // Logout function
  const logout = () => {
    authLogout();
    setAuthState(defaultAuthState);
  };

  const value = {
    ...authState,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
