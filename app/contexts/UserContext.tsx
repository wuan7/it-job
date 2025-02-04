"use client";
import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { user } from '@/constants';

type UserContextType = {
  user: user | null;
  fetchCurrentUser: () => Promise<void>;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<user | null>(null);

  // Hàm lấy thông tin user
  const getCurrentUser = async (): Promise<user | undefined> => {
    try {
      const res = await fetch("/api/auth/current-user");
      if (res.status === 200) {
        const data = await res.json();
        return data.data.user as user;
      } else if (res.status === 401) {
        console.log("User is not authenticated.");
      }
    } catch (error) {
      console.log("Error fetching current user:", error);
    }
  };

  const fetchCurrentUser = async () => {
    
    const userData = await getCurrentUser();
    if (userData) {
      setUser(userData);
    } else {
      setUser(null);
    }
  };



  const logout = async () => {
    setUser(null);
  };

  useLayoutEffect(() => {
    fetchCurrentUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook tùy chỉnh để lấy dữ liệu context của user   
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
