import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { UserContext } from "../dashboard/types";
import * as authApi from "../api/auth";
import { getAuthToken, setAuthToken } from "../api/client";

interface AuthContextValue {
  user: UserContext | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserContext>;
  register: (payload: authApi.RegisterRequest) => Promise<void>;
  logout: () => void;
  setDemoUser: (user: UserContext) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(getAuthToken()));

  useEffect(() => {
    if (!getAuthToken()) return;
    authApi.getCurrentUser()
      .then(setUser)
      .catch(() => setAuthToken(null))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    async login(email, password) {
      const response = await authApi.login({ email, password });
      setAuthToken(response.token);
      setUser(response.user);
      return response.user;
    },
    async register(payload) {
      await authApi.register(payload);
    },
    logout() {
      setAuthToken(null);
      setUser(null);
    },
    setDemoUser(nextUser) {
      setUser(nextUser);
    },
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
