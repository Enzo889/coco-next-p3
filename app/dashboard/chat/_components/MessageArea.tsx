import React, { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageAreaProps {
  messages: Message[];
  currentUserId: number;
  isTyping?: boolean;
  typingUserName?: string;
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  currentUserId,
  isTyping = false,
  typingUserName,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No hay mensajes. ¡Envía el primero!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-2">
        {messages.map((message) => (
          <MessageBubble
            key={message.idMessage}
            message={message}
            isSent={message.idSenderUser === currentUserId}
          />
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
            {typingUserName && (
              <span className="text-xs text-gray-500">
                {typingUserName} está escribiendo...
              </span>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
