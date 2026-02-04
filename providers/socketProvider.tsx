// contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AppState } from 'react-native';
import { SOCKET_URL } from '@/config/socket';
import { useAuthStore } from '@/store/useAuthStore';

const SocketContext = createContext<{ socket: Socket | null; isConnected: boolean } | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    // In your React Native app
    console.log(SOCKET_URL);

    // Initialize socket
    // const socketInstance = io(SOCKET_URL, {
    const socketInstance = io('http://192.168.0.107:3000', {
      transports: ['websocket'],
      autoConnect: true,
      auth: {
        token: session?.access_token,
      },
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Handle app state changes (background/foreground)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        socketInstance.connect();
      } else if (nextAppState === 'background') {
        // Optional: disconnect when app goes to background
        // socketInstance.disconnect();
      }
    });

    // Cleanup on unmount
    return () => {
      subscription.remove();
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
