"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { IPetition } from "@/types/petition.interface";
import type { INCategory } from "@/types/category.interface";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/app/api/service";
import AvailablePetitionsList from "./components/available-petitions-list";
import { IPostulation } from "@/types/postulation.interface";
import { Spinner } from "@/components/ui/spinner";

export default function PostulationsPage() {
  const { data: session, status } = useSession();
  const [availablePetitions, setAvailablePetitions] = useState<IPetition[]>([]);
  const [myPostulations, setMyPostulations] = useState<IPostulation[]>([]);
  const [categories, setCategories] = useState<INCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar todas las peticiones
      const petitions = await api.getPetitions();
      // Filtrar peticiones que no son del usuario actual
      const available = petitions.filter(
        (p) =>
          p.idUserCreate !== session?.user?.id &&
          p.idCustomer !== session?.user?.id
      );
      setAvailablePetitions(available);

      // Cargar postulaciones del usuario actual
      const postulations = await api.getPostulations();
      const userPostulations = postulations.filter(
        (post) => Number(post.idProvider) === session?.user?.id
      );
      setMyPostulations(userPostulations);

      // Cargar categorías
      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
       <div className="flex w-[80vw] justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Por favor inicia sesión
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Postulaciones</h1>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="available">Peticiones Disponibles</TabsTrigger>
            <TabsTrigger value="my-postulations">Mis Postulaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <AvailablePetitionsList
              petitions={availablePetitions}
              categories={categories}
            />
          </TabsContent>

          <TabsContent value="my-postulations" className="space-y-4">
            {myPostulations.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Aún no te has postulado a ninguna petición
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myPostulations.map((post) => (
                  <Card key={post.idpostulation} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          Postulación #{post.idpostulation}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Petición: {post.idPetition}
                        </p>
                        <p className="mb-2">{post.proposal}</p>
                        <div className="flex gap-4 text-sm">
                          <span>Costo: ${post.cost}</span>
                          <span
                            className={
                              post.winner ? "text-green-600 font-semibold" : ""
                            }
                          >
                            {post.winner ? "Ganador" : "Pendiente"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
