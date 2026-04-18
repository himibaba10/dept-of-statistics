'use client';

import { mockOfficials, mockStudents, mockTeachers } from '@/lib/mockData';
import { User } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (type: 'student' | 'teacher' | 'official', id?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock initial load from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('mockUserId');
    if (storedUserId) {
      const allUsers: User[] = [
        ...mockStudents,
        ...mockTeachers,
        ...mockOfficials
      ];
      const foundUser = allUsers.find((u) => u._id === storedUserId);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (foundUser) setUser(foundUser);
    }
    setIsLoading(false);
  }, []);

  const login = (type: 'student' | 'teacher' | 'official', id?: string) => {
    let selectedUser: User | undefined;
    switch (type) {
      case 'student':
        selectedUser = id
          ? mockStudents.find((s) => s._id === id)
          : mockStudents[0];
        break;
      case 'teacher':
        selectedUser = id
          ? mockTeachers.find((t) => t._id === id)
          : mockTeachers.find((t) => t.hasAdminAccess); // Default to admin teacher
        break;
      case 'official':
        selectedUser = id
          ? mockOfficials.find((o) => o._id === id)
          : mockOfficials[0];
        break;
    }

    if (selectedUser) {
      setUser(selectedUser);
      localStorage.setItem('mockUserId', selectedUser._id);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUserId');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
