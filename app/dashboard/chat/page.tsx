"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { ChatContainer } from "./_components/ChatContainer";
import { signOut, useSession } from "next-auth/react";

export default function ChatPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <Button
        onClick={() => signOut()}
        variant="ghost"
        className="absolute top-4 right-4 z-50"
        size="sm"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Cerrar Sesión
      </Button>

      <ChatContainer />
    </div>
  );
}
