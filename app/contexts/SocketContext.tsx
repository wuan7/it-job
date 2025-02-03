"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initSocket, disconnectSocket } from '@/utils/socket';
import { Socket } from 'socket.io-client';
import { useUserContext } from './UserContext';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): Socket | null => {
    
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context.socket;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUserContext();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = initSocket();
    if(user) {
        socketInstance.emit('addUser', user._id);
    }
    setSocket(socketInstance);

    return () => {
      disconnectSocket();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
