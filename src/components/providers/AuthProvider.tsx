'use client';

import { User } from '@/types';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithToken: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function resolveInitialUser(): User | null {
  if (typeof window === 'undefined') return null;

  const accessToken = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('authUser');
  if (accessToken && storedUser) {
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
    }
  }

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(resolveInitialUser());
    setIsLoading(false);

    const handleForceLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const loginWithToken = useCallback(
    (loggedInUser: User, accessToken: string, refreshToken: string) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
