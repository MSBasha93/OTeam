'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, getUserRole, saveToken, removeToken } from '../lib/auth';

interface AuthContextType {
  token: string | null;
  role: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const setToken = (newToken: string) => {
    saveToken(newToken);
    setTokenState(newToken);
    setRole(getUserRole());
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setRole(null);
  };

  useEffect(() => {
    const t = getToken();
    setTokenState(t);
    setRole(getUserRole());
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
