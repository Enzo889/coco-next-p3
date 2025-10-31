// src/components/chat/ChatContainer.tsx (actualizado)

'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ConversationList } from './ConversationList';
import { MessageArea } from './MessageArea';
import { MessageInput } from './MessageInput';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import { useChat } from '@/hooks/useChat';
import { MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { UserBadge } from '@/components/user-role-badge';

export const ChatContainer: React.FC = () => {
  const { data: session } = useSession();
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
  const [selectedUserName, setSelectedUserName] = useState<string>('');

  useEffect(() => {
    if (isConnected) {
      loadConversations();
    }
  }, [isConnected, loadConversations]);

  const handleSelectConversation = async (userId: number) => {
    setSelectedUserId(userId);
    
    const conversation = conversations.find((c) => c.userId === userId);
    if (conversation) {
      setSelectedUserName(conversation.userName);
    }

    await loadMessages(userId);
    markAsRead(userId);
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
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isUserTyping = selectedUserId ? typingUsers.has(selectedUserId) : false;
  const isUserOnline = selectedUserId ? onlineUsers.has(selectedUserId) : false;

  return (
    <div className="flex h-screen bg-gray-100">
      <Card className="w-full md:w-1/3 border-r rounded-none">
        <div className="p-4 bg-linear-to-r from-blue-500 to-blue-600">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Mensajes
            </h2>
            <Badge variant={isConnected ? 'default' : 'destructive'} className="gap-1">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  Conectado
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  Desconectado
                </>
              )}
            </Badge>
          </div>
          {session?.user && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-100">
                {session.user.name}
              </p>
              <UserBadge group={session.user.group} />
            </div>
          )}
        </div>

        <ConversationList
          conversations={conversations}
          selectedUserId={selectedUserId}
          onSelectConversation={handleSelectConversation}
          onlineUsers={onlineUsers}
        />
      </Card>

      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            <div className="p-4 bg-white border-b flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-linear-to-br from-blue-400 to-purple-500 text-white">
                    {getInitials(selectedUserName)}
                  </AvatarFallback>
                </Avatar>
                {isUserOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedUserName}
                </h3>
                {isUserOnline ? (
                  <p className="text-xs text-green-500">En línea</p>
                ) : (
                  <p className="text-xs text-gray-400">Desconectado</p>
                )}
              </div>
            </div>

            <MessageArea
              messages={messages}
              currentUserId={session?.user?.id || 0}
              isTyping={isUserTyping}
              typingUserName={selectedUserName}
            />

            <MessageInput
              onSendMessage={handleSendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              disabled={!isConnected}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <p className="text-gray-500 text-lg">
                Selecciona una conversación para empezar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};