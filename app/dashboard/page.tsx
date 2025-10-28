"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [cats, setCats] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Cargar categorías cuando tengamos sesión
  useEffect(() => {
    const getCats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-interest`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setCats(data);
      } catch (error) {
        console.error("Error fetching cats:", error);
      } finally {
        setLoadingCats(false);
      }
    };

    if (session?.user?.token) {
      getCats();
    }
  }, [session?.user?.token]);

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Session</h2>
      <h2>Cats (User Interests)</h2>
      {loadingCats ? (
        <p>Loading cats...</p>
      ) : (
        <pre>
          <code>{JSON.stringify(cats, null, 2)}</code>
        </pre>
      )}
    </div>
  );
};

export default Dashboard;
