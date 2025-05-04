"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  vehicleInfo?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User, session: any) => void;
  logout: () => void;
  signup: (user: User, session: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On mount, check localStorage for user
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (user: User, session: any) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    // Optionally store session if needed
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/auth');
  };

  const signup = (user: User, session: any) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    // Optionally store session if needed
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
