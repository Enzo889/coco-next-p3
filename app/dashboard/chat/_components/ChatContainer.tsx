"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ConversationList } from "./ConversationList";
import { MessageArea } from "./MessageArea";
import { MessageInput } from "./MessageInput";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/useSocket";
import { useChat } from "@/hooks/useChat";
import {
  MessageCircle,
  Wifi,
  WifiOff,
  Search,
  Phone,
  Video,
  Info,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { usersApi } from "@/app/api/service";

export const ChatContainer: React.FC = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { socket, isConnected } = useSocket({});
  const {
    messages,
    conversations,
    typingUsers,
    onlineUsers,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    loadConversations,
    loadMessages,
  } = useChat({ socket, currentUserId: session?.user?.id || null });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [petitionId, setPetitionId] = useState<number | null>(null);
  const [petitionCreatorName, setPetitionCreatorName] = useState<string>("");

  useEffect(() => {
    if (isConnected) {
      loadConversations();
    }
  }, [isConnected, loadConversations]);

  const userIdParam = searchParams.get("userId");

  // Manejar parámetros de URL (cuando viene desde postulaciones)
  useEffect(() => {
    const userIdParam = searchParams.get("userId");
    const petitionIdParam = searchParams.get("petitionId");

    if (userIdParam && isConnected) {
      const userId = parseInt(userIdParam);
      setPetitionId(petitionIdParam ? parseInt(petitionIdParam) : null);

      // Esperar a que se carguen las conversaciones
      setTimeout(() => {
        // eslint-disable-next-line react-hooks/immutability
        handleSelectConversation(userId);
        toast.success("Chat iniciado", {
          description: "Puedes comenzar a comunicarte con el proveedor",
        });
      }, 1000);
    }
  }, [searchParams, isConnected]);

  useEffect(() => {
    const fetchPetitionCreator = async () => {
      if (petitionId) {
        try {
          const user = await usersApi.getUser(Number(userIdParam));
          setPetitionCreatorName(user.name);
        } catch (error) {
          console.error("Error fetching petition creator:", error);
          setPetitionCreatorName("Usuario desconocido");
        }
      }
    };

    fetchPetitionCreator();
  }, [petitionId, userIdParam]);

  const handleSelectConversation = async (userId: number) => {
    setSelectedUserId(userId);

    const conversation = conversations.find((c) => c.userId === userId);
    if (conversation) {
      setSelectedUserName(conversation.userName);
    }

    await loadMessages(userId);
    markAsRead(userId);
    setIsMobileMenuOpen(false);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedUserId) return;
    sendMessage(selectedUserId, content);
  };

  const handleTypingStart = () => {
    if (!selectedUserId) return;
    startTyping(selectedUserId);
  };

  const handleTypingStop = () => {
    if (!selectedUserId) return;
    stopTyping(selectedUserId);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUserTyping = selectedUserId ? typingUsers.has(selectedUserId) : false;
  const isUserOnline = selectedUserId ? onlineUsers.has(selectedUserId) : false;
  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Lista de conversaciones */}
      <div
        className={cn(
          "flex flex-col  border  rounded-2xl m-2.5 bg-primary/10  transition-all duration-300",
          showSidebar ? "w-full md:w-96" : "w-0 md:w-0",
          isMobileMenuOpen ? "fixed inset-0 z-50 md:relative" : "hidden md:flex"
        )}
      >
        {/* Header del sidebar */}
        <div className="shrink-0 border-b border">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {session?.user?.name ? getInitials(session.user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-primary dark:text-primary-foreground">
                    Mensajes
                  </h1>
                  {session?.user && (
                    <p className="text-xs text-foreground/70">
                      @{session.user.name?.toLowerCase().replace(/\s/g, "")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {totalUnread > 0 && (
                  <Badge className="bg-blue-500 text-white">
                    {totalUnread}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          {/* Status de conexión */}
          <div className="px-4 pb-3">
            <div
              className={cn(
                "flex items-center gap-2 text-xs px-3 py-1.5 rounded-full w-fit",
                isConnected
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              )}
            >
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span className="font-medium">En línea</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span className="font-medium">Desconectado</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={filteredConversations}
            selectedUserId={selectedUserId}
            onSelectConversation={handleSelectConversation}
            onlineUsers={onlineUsers}
          />
        </div>
      </div>

      {/* Área principal de chat */}
      <div className="flex-1 flex flex-col m-2.5 bg-primary/10 rounded-2xl  ">
        {selectedUserId ? (
          <>
            {/* Header del chat */}
            <div className="shrink-0 border-b border-gray-200 bg-white">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-9 w-9"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>

                  <div className="relative">
                    <Avatar className="h-11 w-11 ring-2 ring-white">
                      <AvatarFallback className="bg-linear-to-br from-blue-400 to-purple-500 text-white font-semibold">
                        {getInitials(selectedUserName || "p")}
                      </AvatarFallback>
                    </Avatar>
                    {isUserOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 text-[15px]">
                      {selectedUserName}
                    </h3>
                    {petitionId && petitionCreatorName && (
                      <p className="text-xs text-blue-600">
                        {petitionCreatorName}
                      </p>
                    )}
                    {isUserTyping ? (
                      <p className="text-xs text-blue-500 font-medium">
                        escribiendo...
                      </p>
                    ) : isUserOnline ? (
                      <p className="text-xs text-green-600 font-medium">
                        En línea
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Desconectado</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-gray-100"
                  >
                    <Phone className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-gray-100"
                  >
                    <Video className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-gray-100"
                  >
                    <Info className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <MessageArea
              messages={messages}
              currentUserId={session?.user?.id || 0}
              isTyping={isUserTyping}
              typingUserName={selectedUserName}
            />

            {/* Input de mensajes */}
            <MessageInput
              onSendMessage={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              disabled={!isConnected}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-linear-to-br from-accent-foreground to-primary/50 p-8 border rounded-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden absolute top-4 left-4 h-9 w-9"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="text-center max-w-md">
              <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-br from-primary to-primary/50 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                Tus Mensajes
              </h2>
              <p className="text-primary-foreground/50 mb-6">
                Selecciona una conversación de la lista para comenzar a chatear
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 cursor-pointer"
                >
                  Ver Conversaciones
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
