// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { login as loginService, register as registerService } from '../services/authService';

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);
    setToken(response.access_token);
  };

  const register = async (email: string, password: string) => {
    const response = await registerService(email, password);
    setToken(response.access_token);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
