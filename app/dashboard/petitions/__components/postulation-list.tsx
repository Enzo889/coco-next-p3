"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IPostulation } from "@/types/postulation.interface";
import { api } from "@/app/api/service";
import { toast } from "sonner";

interface PostulationsListProps {
  petitionId: number;
}

export default function PostulationsList({
  petitionId,
}: PostulationsListProps) {
  const [postulations, setPostulations] = useState<IPostulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPostulations();
  }, [petitionId]);

  const loadPostulations = async () => {
    try {
      setLoading(true);
      const allPostulations = await api.getPostulations();
      const filtered = allPostulations.filter(
        (p) => p.idPetition === petitionId.toString()
      );
      setPostulations(filtered);
    } catch (error) {
      console.error("Error loading postulations:", error);
      toast.error("Error", {
        description: "No se pudieron cargar las postulaciones",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWinner = async (postulationId: number) => {
    try {
      await api.updatePostulation(postulationId, { winner: true });
      toast.success("Exito", {
        description: "Ganador seleccionado",
      });
      loadPostulations();
    } catch (error) {
      console.error("Error selecting winner:", error);
      toast.error("Error", {
        description: "No se pudo seleccionar el ganador",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando postulaciones...</div>;
  }

  if (postulations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground">No hay postulaciones aún</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {postulations.map((postulation) => (
        <Card key={postulation.idpostulation}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  Postulación #{postulation.idpostulation}
                </CardTitle>
                {postulation.winner && (
                  <Badge className="mt-2 bg-green-600">Ganador</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Propuesta</p>
              <p className="font-medium">{postulation.proposal}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Costo</p>
                <p className="font-semibold">${postulation.cost}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha</p>
                <p className="font-medium">
                  {format(new Date(postulation.dateCreate), "d MMM", {
                    locale: es,
                  })}
                </p>
              </div>
            </div>
            {!postulation.winner && (
              <Button
                onClick={() => handleSelectWinner(postulation.idpostulation)}
                variant="outline"
                className="w-full mt-2"
              >
                Seleccionar como Ganador
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
