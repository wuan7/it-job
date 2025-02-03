'use client';

import { useEffect } from 'react';
import { initSocket } from '@/utils/socket';
import { useUserContext } from '@/app/contexts/UserContext';

const SocketProvider = () => {
    const { user } = useUserContext();
  useEffect(() => {
    if (!user) return;
    const socket = initSocket();
    if(user) {

        
        socket.emit('addUser', user._id);
    
        
        socket.on('newCV', (message) => {
          console.log('🔔 Notification:', message);
        });
    
        socket.on('cvViewedNotification', (message) => {
          console.log('👀 CV Viewed:', message);
        });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return null;
};

export default SocketProvider;
