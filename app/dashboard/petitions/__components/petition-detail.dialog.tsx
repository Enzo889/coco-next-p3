"use client";

import type { IPetition } from "@/types/petition.interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PostulationsList from "./postulation-list";
import PostulationForm from "./postulation-form";
import { useEffect, useState } from "react";
import { api } from "@/app/api/service";
import { IPostulation } from "@/types/postulation.interface";

interface PetitionDetailDialogProps {
  petition: IPetition;
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
}

export default function PetitionDetailDialog({
  petition,
  isOpen,
  onClose,
  categoryName,
}: PetitionDetailDialogProps) {
  const [postulationCounts, setPostulationCounts] = useState<
    Record<number, number>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostulationCounts = async () => {
      try {
        const allPostulations = await api.getPostulations();
        const counts: Record<number, number> = {};

        allPostulations.forEach((postulation: IPostulation) => {
          const petitionId = Number(postulation.idPetition);
          counts[petitionId] = (counts[petitionId] || 0) + 1;
        });

        setPostulationCounts(counts);
      } catch (error) {
        console.error("[v0] Error fetching postulations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostulationCounts();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{petition.description}</DialogTitle>
          <DialogDescription>ID: {petition.idPetition}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info principal */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Badge variant="outline">{categoryName}</Badge>
              <Badge
                variant={
                  petition.idState === 1
                    ? "default"
                    : petition.idState === 2
                    ? "secondary"
                    : "destructive"
                }
              >
                {petition.idState === 1
                  ? "Activa"
                  : petition.idState === 2
                  ? "En Progreso"
                  : "Completada"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-muted-foreground text-xs font-medium">
                  Desde
                </p>
                <p className="font-semibold">
                  {petition.dateSince
                    ? format(new Date(petition.dateSince), "d MMM", {
                        locale: es,
                      })
                    : "-"}
                </p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-muted-foreground text-xs font-medium">
                  Hasta
                </p>
                <p className="font-semibold">
                  {petition.dateUntil
                    ? format(new Date(petition.dateUntil), "d MMM", {
                        locale: es,
                      })
                    : "-"}
                </p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-muted-foreground text-xs font-medium">
                  Creada
                </p>
                <p className="font-semibold">
                  {format(new Date(petition.dateCreate || 5), "d MMM yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-muted-foreground text-xs font-medium">
                  Postulantes
                </p>
                <p className="font-semibold">
                  {isLoading
                    ? "-"
                    : petition.idPetition
                    ? postulationCounts[petition.idPetition] || 0
                    : 0}
                </p>{" "}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="postulate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="postulate">Postularme</TabsTrigger>
              <TabsTrigger value="postulations">Postulaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="postulate">
              <Card>
                <CardContent className="pt-6">
                  <PostulationForm
                    petitionId={petition.idPetition || 5}
                    onSuccess={onClose}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="postulations">
              <PostulationsList petitionId={petition.idPetition || 5} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
