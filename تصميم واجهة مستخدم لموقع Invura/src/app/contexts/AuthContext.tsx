import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../lib/api";
import type { User } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!api.token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.me();
      setUser(response.user);
    } catch {
      api.setToken("");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.login({ email, password });
    api.setToken(response.token);
    setUser(response.user);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const response = await api.signup({ name, email, password });
    api.setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    api.setToken("");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      refresh,
      isAuthenticated: !!user,
    }),
    [loading, login, logout, refresh, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
