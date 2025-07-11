import { createContext, useContext } from 'react';

interface AuthContextValue {
  email: string;
  isAuthenticated: boolean;
  isClient: boolean;
  role: string
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthContext.Provider");
  return ctx;
}
