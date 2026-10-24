/* Author: Nithish Kaliannan Ananth */
// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, sessionExpired } = useAuth();
  const location = useLocation();

  // AuthContext drops the token the moment any request returns 401, so
  // this redirect happens immediately — no manual refresh needed.
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname, expired: sessionExpired }} />;
  }

  return <>{children}</>;
}
