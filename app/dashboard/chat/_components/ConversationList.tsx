"use client";

import React from "react";
import { Conversation } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";

interface ConversationListProps {
  conversations: Conversation[];
  selectedUserId: number | null;
  onSelectConversation: (userId: number) => void;
  onlineUsers: Set<number>;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedUserId,
  onSelectConversation,
  onlineUsers,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date | string) => {
    const messageDate = new Date(date);

    if (isToday(messageDate)) {
      return format(messageDate, "HH:mm", { locale: es });
    } else if (isYesterday(messageDate)) {
      return "Ayer";
    } else {
      return format(messageDate, "dd/MM", { locale: es });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No hay conversaciones</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conv) => {
        const isOnline = onlineUsers.has(conv.userId);
        const isSelected = selectedUserId === conv.userId;

        return (
          <Card
            key={conv.userId}
            className={cn(
              "p-4 cursor-pointer hover:bg-gray-50 transition-colors border-0 border-b rounded-none",
              isSelected && "bg-blue-50"
            )}
            onClick={() => onSelectConversation(conv.userId)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-linear-to-br from-blue-400 to-purple-500 text-white">
                    {getInitials(conv.userName)}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {conv.userName}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {formatDate(conv.lastMessageDate)}
                  </span>
                </div>

                <p className="text-sm text-gray-500 truncate">
                  {conv.lastMessage}
                </p>
              </div>

              {conv.unreadCount > 0 && (
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  {conv.unreadCount}
                </Badge>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
