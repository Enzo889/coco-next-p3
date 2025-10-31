"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface UseSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const { data: session } = useSession();
  const { onConnect, onDisconnect, onError } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Si no hay sesión, no conectar
    if (!session?.accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // Crear conexión con el token de NextAuth
    const WS_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    const socket = io(`${WS_URL}/chat`, {
      transports: ["websocket"],
      auth: {
        token: session.accessToken, // 👈 Token de NextAuth
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
      setIsConnected(true);
      onConnect?.();
    });

    socket.on("disconnect", (reason) => {
      console.log("👋 Socket desconectado:", reason);
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Error de conexión:", error);
      setIsConnected(false);
      onError?.(error);
    });

    socket.on("error", (error) => {
      console.error("❌ Error:", error);
      onError?.(error);
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.accessToken, onConnect, onDisconnect, onError]);

  return {
    // eslint-disable-next-line react-hooks/refs
    socket: socketRef.current,
    isConnected,
  };
};
