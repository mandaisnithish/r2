// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { login as loginApi } from "../api/authApi";
import type { LoginRequest } from "../types/auth";

interface AuthContextValue {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "aquaholics_admin_token";
const EMAIL_KEY = "aquaholics_admin_email";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy init — reads localStorage on first render instantly, no delay
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [email, setEmail] = useState<string | null>(() =>
    localStorage.getItem(EMAIL_KEY)
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Token already loaded above, just mark loading done
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const res = await loginApi(credentials);
    setToken(res.token);
    setEmail(res.email);
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(EMAIL_KEY, res.email);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ token, email, isAuthenticated: !!token, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}