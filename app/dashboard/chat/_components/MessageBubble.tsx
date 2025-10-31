"use client";

import React from "react";
import { Message } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isSent,
}) => {
  const formatTime = (date: Date | string) => {
    const messageDate = new Date(date);
    return format(messageDate, "HH:mm", { locale: es });
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "flex gap-2 mb-4",
        isSent ? "justify-end" : "justify-start"
      )}
    >
      {!isSent && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {getInitials(message.senderName)}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn("flex flex-col", isSent ? "items-end" : "items-start")}
      >
        {!isSent && (
          <span className="text-xs text-gray-500 mb-1 px-1">
            {message.senderName}
          </span>
        )}

        <div
          className={cn(
            "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl wrap-break-word",
            isSent
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-100 text-gray-900 rounded-bl-none"
          )}
        >
          <p className="text-sm">{message.content}</p>

          <div className="flex items-center justify-end gap-1 mt-1">
            <span
              className={cn(
                "text-xs",
                isSent ? "text-blue-100" : "text-gray-500"
              )}
            >
              {formatTime(message.dateCreate)}
            </span>

            {isSent && (
              <span className="text-xs">
                {message.viewed ? (
                  <CheckCheck className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {isSent && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-500 text-white text-xs">
            {getInitials(message.senderName)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
