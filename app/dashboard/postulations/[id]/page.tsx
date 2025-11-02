"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import type { IPetition } from "@/types/petition.interface";
import type { INCategory } from "@/types/category.interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/app/api/service";
import { toast } from "sonner";
import PostulationsList from "../../petitions/__components/postulation-list";
import PostulationForm from "../../petitions/__components/postulation-form";

export default function PetitionDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const petitionId = params?.id as string;

  const [petition, setPetition] = useState<IPetition | null>(null);
  const [categories, setCategories] = useState<INCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostulationForm, setShowPostulationForm] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && petitionId) {
      loadData();
    }
  }, [status, petitionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const petitionData = await api.getPetition(petitionId);
      setPetition(petitionData);

      setIsCreator(petitionData.idUserCreate === session?.user?.id);

      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading petition:", error);
      toast.error("Error", {
        description: "No se pudo cargar la petición",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (idCategory: number) => {
    return (
      categories.find((c) => c.idCategory === idCategory)?.name ||
      "Sin categoría"
    );
  };

  const handlePostulationSuccess = () => {
    setShowPostulationForm(false);
    toast.success("Exito", {
      description: "Tu postulación ha sido registrada",
    });
    setTimeout(() => loadData(), 1000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
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

  if (!petition) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Petición no encontrada</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6"
        >
          Volver
        </Button>

        <div className="grid gap-6">
          {/* Detalles de la petición */}
          <Card className="p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">
                Petición #{petition.idPetition}
              </h1>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span className="px-3 py-1 rounded-full bg-muted">
                  {getCategoryName(petition.idCategory || 0)}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                <p className="text-foreground leading-relaxed">
                  {petition.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Fecha de Inicio
                  </p>
                  <p className="font-semibold">
                    {petition.dateSince
                      ? new Date(petition.dateSince).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Fecha de Vencimiento
                  </p>
                  <p className="font-semibold">
                    {petition.dateUntil
                      ? new Date(petition.dateUntil).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p className="font-semibold">
                  {petition.idState === 1
                    ? "Abierta"
                    : petition.idState === 2
                    ? "En Proceso"
                    : "Cerrada"}
                </p>
              </div>
            </div>
          </Card>

          {isCreator && (
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Postulaciones Recibidas
              </h2>
              <PostulationsList petitionId={Number(petitionId)} />
            </Card>
          )}

          {/* Formulario de postulación - solo para usuarios que no son creadores */}
          {!isCreator && (
            <>
              {!showPostulationForm ? (
                <Button
                  onClick={() => setShowPostulationForm(true)}
                  size="lg"
                  className="w-full"
                >
                  Postularme a esta Petición
                </Button>
              ) : (
                <Card className="p-6 md:p-8">
                  <h2 className="text-2xl font-semibold mb-4">
                    Mi Postulación
                  </h2>
                  <PostulationForm
                    petitionId={Number(petitionId)}
                    onSuccess={handlePostulationSuccess}
                  />
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
