"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IPostulation } from "@/types/postulation.interface";
import { api, usersApi } from "@/app/api/service";
import { toast } from "sonner";
import { MessageCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { TYPE_PETITION } from "@/types/type_petition.enum";

interface PostulationsListProps {
  petitionId: number;
}

export default function PostulationsList({
  petitionId,
}: PostulationsListProps) {
  const router = useRouter();
  const [postulations, setPostulations] = useState<IPostulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [redirecting, setRedirecting] = useState<number | null>(null);

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

      const names: Record<string, string> = {};
      for (const postulation of filtered) {
        if (postulation.idProvider && !names[postulation.idProvider]) {
          try {
            const user = await usersApi.getUser(Number(postulation.idProvider));
            names[postulation.idProvider] = user.name || "Usuario desconocido";
          } catch (error) {
            names[postulation.idProvider] = "Usuario desconocido";
            console.log("error cargando el nombre", error);
          }
        }
      }
      setUserNames(names);
    } catch (error) {
      console.error("Error loading postulations:", error);
      toast.error("Error", {
        description: "No se pudieron cargar las postulaciones",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWinner = async (
    postulationId: number,
    postulation: IPostulation
  ) => {
    try {
      await api.updatePostulation(postulationId, { winner: true });
      try {
        const petition = await api.getPetition(Number(postulation.idPetition));
        if (postulation.idProvider) {
          await api.createNotification({
            idProvider: Number(postulation.idProvider),
            type: TYPE_PETITION.petitionSelected,
            message: `¡Felicidades! Tu postulación fue seleccionada en: ${petition.description?.substring(
              0,
              40
            )}...`,
            viewed: false,
            idUserUpdate: Number(postulation.idProvider),
            idUserCreate: Number(postulation.idProvider),
            deleted: false,
          });
        }
      } catch (notificationError) {
        console.error(" Error sending winner notification:", notificationError);
      }

      try {
        const allPostulations = await api.getPostulations();
        const otherPostulations = allPostulations.filter(
          (p) =>
            p.idPetition === postulation.idPetition &&
            p.idpostulation !== postulationId &&
            !p.winner
        );

        const petition = await api.getPetition(Number(postulation.idPetition));

        for (const rejected of otherPostulations) {
          if (rejected.idProvider) {
            await api.createNotification({
              idProvider: Number(rejected.idProvider),
              type: TYPE_PETITION.petitionRejected,
              message: `Lamentablemente, tu postulación no fue seleccionada en: ${petition.description?.substring(
                0,
                40
              )}...`,
              viewed: false,
              idUserUpdate: Number(rejected.idProvider),
              idUserCreate: Number(rejected.idProvider),
              deleted: false,
            });
          }
        }
      } catch (rejectionError) {
        console.error(
          " Error sending rejection notifications:",
          rejectionError
        );
      }

      toast.success("Exito", {
        description: "Ganador seleccionado y notificaciones enviadas",
      });

      loadPostulations();
    } catch (error) {
      console.error("Error selecting winner:", error);
      toast.error("Error", {
        description: "No se pudo seleccionar el ganador",
      });
    }
  };

  const handleStartChat = async (postulation: IPostulation) => {
    try {
      setRedirecting(postulation.idpostulation || null);

      // Aquí puedes obtener el ID del usuario del proveedor
      // Asumiendo que la postulación tiene un campo idProvider o similar
      const providerId = postulation.idProvider; // Ajusta según tu estructura

      if (!providerId) {
        toast.error("Error", {
          description: "No se pudo identificar al proveedor",
        });
        return;
      }

      // Redirigir al chat con el parámetro del usuario
      router.push(
        `/dashboard/chat?userId=${providerId}&petitionId=${petitionId}`
      );

      toast.success("Redirigiendo", {
        description: "Abriendo chat con el proveedor...",
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Error", {
        description: "No se pudo iniciar la conversación",
      });
    } finally {
      setRedirecting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        {" "}
        <Spinner />{" "}
      </div>
    );
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
                  {userNames[postulation.idProvider || ""] || "Cargando..."}
                </CardTitle>
                {postulation.winner ? (
                  <Badge className="mt-2 bg-green-600">Ganador</Badge>
                ) : (
                  ""
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
                  {format(new Date(postulation.dateCreate || 0), "d MMM", {
                    locale: es,
                  })}
                </p>
              </div>
            </div>
            {!postulation.winner ? (
              <Button
                onClick={() =>
                  handleSelectWinner(
                    postulation.idpostulation || 1,
                    postulation
                  )
                }
                disabled={postulation.winner}
                variant="ghost"
                className="w-full mt-2 disabled:bg-red-800 "
              >
                Seleccionar como Ganador
              </Button>
            ) : (
              <Button
                onClick={() => handleStartChat(postulation)}
                disabled={redirecting === postulation.idpostulation}
                className="w-full mt-2 bg-blue-500 hover:bg-blue-600"
              >
                {redirecting === postulation.idpostulation ? (
                  <>
                    <Spinner />
                    Abriendo chat...
                  </>
                ) : (
                  <>
                    <MessageCircleIcon className="mr-2 h-4 w-4" />
                    Comunicarse
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
