"use client";

import { ChatContainer } from "./_components/ChatContainer";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

export default function ChatPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="relative h-screen w-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex-1 ">
      <ChatContainer />
    </div>
  );
}
