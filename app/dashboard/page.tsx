"use client";
import { useSession } from "next-auth/react";
import { api } from "../api/service";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Session</h2>
      <Button
        onClick={async () => {
          api.addUserInterest({
            idCategory: 20,
            idUser: session?.user.id || 370,
          });
        }}
      >
        {session ? `Logged in as ${session.user?.email}` : "Not logged in"}
      </Button>
    </div>
  );
};

export default Dashboard;
