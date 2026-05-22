import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authApi, tryRefreshAccessToken, type PublicUser } from "@/lib/api";
import {
  clearAllStoredAuth,
  getAccessToken,
  setAccessToken,
  setRememberMe,
  setSavedEmail,
} from "@/lib/auth-storage";

export type LoginOptions = {
  rememberMe?: boolean;
};

export type AuthContextValue = {
  user: PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, options?: LoginOptions) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function persistSession(token: string, rememberMe: boolean) {
  setRememberMe(rememberMe);
  setAccessToken(token, rememberMe ? "local" : "session");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const { user: next } = await authApi.me();
      setUser(next);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      if (!getAccessToken()) {
        await tryRefreshAccessToken();
      }
      if (cancelled) return;
      await refreshUser();
      if (!cancelled) setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string, options?: LoginOptions) => {
    const rememberMe = options?.rememberMe ?? true;
    const normalizedEmail = email.trim().toLowerCase();
    const data = await authApi.login({ email: normalizedEmail, password });
    persistSession(data.token, rememberMe);
    if (rememberMe) {
      setSavedEmail(normalizedEmail);
    }
    setUser(data.user);
  }, []);

  const register = useCallback(async (input: { name: string; email: string; password: string }) => {
    const data = await authApi.register({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
    });
    persistSession(data.token, true);
    setSavedEmail(data.user.email);
    setUser(data.user);
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const data = await authApi.google({ credential });
    persistSession(data.token, true);
    setSavedEmail(data.user.email);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* still clear client session */
    } finally {
      clearAllStoredAuth();
      setUser(null);
      toast.success("Signed out");
      await navigate({ to: "/login" });
    }
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      loginWithGoogle,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, loginWithGoogle, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
