// src/hooks/useChat.ts

"use client";

import { useEffect, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { Message, Conversation, SendMessageDto } from "@/types/chat";
import { chatApi } from "@/app/api/service";

interface UseChatOptions {
  socket: Socket | null;
  currentUserId: number | null;
}

export const useChat = ({ socket, currentUserId }: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [unreadCount, setUnreadCount] = useState<Record<number, number>>({});

  // Cargar conversaciones
  const loadConversations = useCallback(async () => {
    try {
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }, []);

  // Cargar mensajes de una conversación
  const loadMessages = useCallback(async (otherUserId: number) => {
    try {
      const data = await chatApi.getConversation(otherUserId);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }, []);

  // Cargar contador de no leídos
  const loadUnreadCount = useCallback(async () => {
    try {
      const data = await chatApi.getUnreadCount();
      setUnreadCount(data);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  }, []);

  // Enviar mensaje
  const sendMessage = useCallback(
    (receiverId: number, content: string, petitionId?: number) => {
      if (!socket) return;

      const messageData: SendMessageDto = {
        receiverId,
        content,
        ...(petitionId && { petitionId }),
      };

      socket.emit("message:send", messageData);
    },
    [socket]
  );

  // Marcar como leído
  const markAsRead = useCallback(
    (otherUserId: number) => {
      if (!socket) return;
      socket.emit("message:read", { otherUserId });
    },
    [socket]
  );

  // Indicar que está escribiendo
  const startTyping = useCallback(
    (receiverId: number) => {
      if (!socket) return;
      socket.emit("typing:start", { receiverId });
    },
    [socket]
  );

  // Indicar que dejó de escribir
  const stopTyping = useCallback(
    (receiverId: number) => {
      if (!socket) return;
      socket.emit("typing:stop", { receiverId });
    },
    [socket]
  );

  // Solicitar usuarios online
  const requestOnlineUsers = useCallback(() => {
    if (!socket) return;
    socket.emit("users:request");
  }, [socket]);

  // Escuchar eventos del socket
  useEffect(() => {
    if (!socket) return;

    // Mensaje enviado
    socket.on("message:sent", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      loadConversations(); // Actualizar lista de conversaciones
    });

    // Mensaje recibido
    socket.on("message:receive", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      loadConversations();

      // Reproducir sonido (opcional)
      // const audio = new Audio('/notification.mp3');
      // audio.play().catch(e => console.log('Could not play sound'));
    });

    // Mensajes marcados como leídos
    socket.on(
      "messages:read",
      ({ userId }: { userId: number; count: number }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.idSenderUser === currentUserId && msg.idReceiverUser === userId
              ? { ...msg, viewed: true }
              : msg
          )
        );
        loadConversations();
      }
    );

    // Usuario escribiendo
    socket.on(
      "typing:start",
      ({ userId }: { userId: number; userName: string }) => {
        setTypingUsers((prev) => new Set(prev).add(userId));
      }
    );

    // Usuario dejó de escribir
    socket.on("typing:stop", ({ userId }: { userId: number }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // Usuario online
    socket.on(
      "user:online",
      ({ userId }: { userId: number; userName: string }) => {
        setOnlineUsers((prev) => new Set(prev).add(userId));
      }
    );

    // Usuario offline
    socket.on(
      "user:offline",
      ({ userId }: { userId: number; userName: string }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    );

    // Lista de usuarios online
    socket.on(
      "users:online",
      ({ userIds }: { userIds: number[]; count?: number }) => {
        setOnlineUsers(new Set(userIds));
      }
    );

    return () => {
      socket.off("message:sent");
      socket.off("message:receive");
      socket.off("messages:read");
      socket.off("typing:start");
      socket.off("typing:stop");
      socket.off("user:online");
      socket.off("user:offline");
      socket.off("users:online");
    };
  }, [socket, currentUserId, loadConversations]);

  return {
    messages,
    conversations,
    typingUsers,
    onlineUsers,
    unreadCount,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    requestOnlineUsers,
    loadConversations,
    loadMessages,
    loadUnreadCount,
  };
};
