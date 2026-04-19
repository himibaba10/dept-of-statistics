'use client';

import { mockStudents, mockTeachers } from '@/lib/mockData';
import { Official, User } from '@/types';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  // Mock login for student/teacher (dev only)
  login: (type: 'student' | 'teacher', id?: string) => void;
  // Real JWT login for officials — called after successful API response
  loginAsOfficial: (
    user: Official,
    accessToken: string,
    refreshToken: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Read initial auth state synchronously from localStorage (runs once on mount). */
function resolveInitialUser(): User | null {
  if (typeof window === 'undefined') return null;

  // 1. Try real official session first
  const accessToken = localStorage.getItem('accessToken');
  const storedOfficial = localStorage.getItem('officialUser');
  if (accessToken && storedOfficial) {
    try {
      return JSON.parse(storedOfficial) as Official;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('officialUser');
    }
  }

  // 2. Fall back to mock session (student / teacher)
  const mockUserId = localStorage.getItem('mockUserId');
  if (mockUserId) {
    const found = ([...mockStudents, ...mockTeachers] as User[]).find(
      (u) => u._id === mockUserId
    );
    if (found) return found;
  }

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(resolveInitialUser);
  // localStorage is read synchronously in the initializer, so loading is never deferred
  const isLoading = false;

  // Mock login — student or teacher only
  const login = useCallback((type: 'student' | 'teacher', id?: string) => {
    let selected: User | undefined;
    if (type === 'student') {
      selected = id ? mockStudents.find((s) => s._id === id) : mockStudents[0];
    } else {
      selected = id
        ? mockTeachers.find((t) => t._id === id)
        : mockTeachers.find((t) => t.hasAdminAccess);
    }
    if (selected) {
      setUser(selected);
      localStorage.setItem('mockUserId', selected._id);
    }
  }, []);

  // Real login — official with JWT
  const loginAsOfficial = useCallback(
    (officialUser: Official, accessToken: string, refreshToken: string) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('officialUser', JSON.stringify(officialUser));
      // Clear any mock session
      localStorage.removeItem('mockUserId');
      setUser(officialUser);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('officialUser');
    localStorage.removeItem('mockUserId');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, loginAsOfficial, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
