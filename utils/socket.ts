// utils/socket.ts

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (socket) return socket; // Trả về socket nếu đã kết nối

  socket = io('http://localhost:8000', {
    transports: ['websocket'],
  });
  
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket; // Trả về socket nếu có kết nối
