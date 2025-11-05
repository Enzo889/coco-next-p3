"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { IPetition } from "@/types/petition.interface";
import type { INCategory } from "@/types/category.interface";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/app/api/service";
import MyPetitionsList from "./__components/petition-list";
import CreatePetitionForm from "./__components/create-petition-form";
import { Spinner } from "@/components/ui/spinner";

export default function PetitionsPage() {
  const { data: session, status } = useSession();
  const [myPetitions, setMyPetitions] = useState<IPetition[]>([]);
  const [categories, setCategories] = useState<INCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cargar peticiones y categorías
  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status, refreshTrigger]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar todas las peticiones y filtrar por usuario actual
      const petitions = await api.getPetitions();
      const myPetitionsList = petitions.filter(
        (p) =>
          p.idCustomer === session?.user?.id ||
          p.idUserCreate === session?.user?.id
      );
      setMyPetitions(myPetitionsList);

      // Cargar categorías
      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePetitionCreated = () => {
    // Refrescar la lista de peticiones
    setRefreshTrigger((prev) => prev + 1);
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
        Por favor
        <a href="/login">inicia sesión</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mis Peticiones</h1>

        <Tabs defaultValue="my-petitions" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="my-petitions">Mis Peticiones</TabsTrigger>
            <TabsTrigger value="create">Crear Nueva</TabsTrigger>
          </TabsList>

          <TabsContent value="my-petitions" className="space-y-4">
            <MyPetitionsList petitions={myPetitions} categories={categories} />
          </TabsContent>

          <TabsContent value="create">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Crear Nueva Petición
              </h2>
              <CreatePetitionForm
                categories={categories}
                onSuccess={handlePetitionCreated}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
