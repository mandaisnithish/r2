// src/context/AuthContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { login as loginApi } from "../api/authApi";
import type { LoginRequest } from "../types/auth";
import {
  AUTH_EXPIRED_EVENT,
  EMAIL_KEY,
  TOKEN_KEY,
  clearStoredSession,
} from "../lib/authEvents";

interface AuthContextValue {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** True after the API rejected the token; cleared on the next login. */
  sessionExpired: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy init — reads localStorage on first render instantly, no delay.
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem(EMAIL_KEY));
  const [sessionExpired, setSessionExpired] = useState(false);

  const logout = useCallback(() => {
    setToken(null);
    setEmail(null);
    clearStoredSession();
  }, []);

  // 401 from any admin request: drop the session now, not on next refresh.
  useEffect(() => {
    const onExpired = () => {
      setToken(null);
      setEmail(null);
      setSessionExpired(true);
    };
    // Logging out (or in) in another tab keeps this tab in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) setToken(e.newValue);
      if (e.key === EMAIL_KEY) setEmail(e.newValue);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const res = await loginApi(credentials);
    setToken(res.token);
    setEmail(res.email);
    setSessionExpired(false);
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(EMAIL_KEY, res.email);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      email,
      isAuthenticated: !!token,
      isLoading: false,
      sessionExpired,
      login,
      logout,
    }),
    [token, email, sessionExpired, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
