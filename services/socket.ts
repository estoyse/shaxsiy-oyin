import { io, Socket } from 'socket.io-client';
import { supabase } from '@/lib/supabase'; // Your existing config

let socket: Socket | null = null;

export const getSocket = async () => {
  if (socket?.connected) return socket;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  socket = io(process.env.EXPO_PUBLIC_SERVER_URL, {
    auth: { token: session?.access_token },
    transports: ['websocket'], // Force WebSocket for speed
    autoConnect: false,
  });

  return socket;
};
