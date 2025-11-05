"use client";

import type { IPetition } from "@/types/petition.interface";
import type { INCategory } from "@/types/category.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PetitionDetailDialog from "./petition-detail.dialog";

interface MyPetitionsListProps {
  petitions: IPetition[];
  categories: INCategory[];
}

export default function MyPetitionsList({
  petitions,
  categories,
}: MyPetitionsListProps) {
  const [selectedPetition, setSelectedPetition] = useState<IPetition | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getCategoryName = (categoryId: number) => {
    return (
      categories.find((c) => c.idCategory === categoryId)?.name ||
      "Sin categoría"
    );
  };

  const getStatusColor = (status: number | null) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (petitions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-lg">
            No tienes peticiones aún
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Crea una nueva petición para comenzar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {petitions.map((petition) => (
          <Card
            key={petition.idPetition}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    {petition.description}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {getCategoryName(petition.idCategory || 0)}
                    </Badge>
                    <Badge className={getStatusColor(petition.idState)}>
                      {petition.idState === 1
                        ? "Activa"
                        : petition.idState === 2
                        ? "En Progreso"
                        : "Completada"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Desde</p>
                  <p className="font-medium">
                    {petition.dateSince
                      ? format(new Date(petition.dateSince), "d MMM yyyy", {
                          locale: es,
                        })
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hasta</p>
                  <p className="font-medium">
                    {petition.dateUntil
                      ? format(new Date(petition.dateUntil), "d MMM yyyy", {
                          locale: es,
                        })
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Creada</p>
                  <p className="font-medium">
                    {format(new Date(petition.dateCreate || 5), "d MMM", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Postulantes</p>
                  <p className="font-medium">6666666666666666</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedPetition(petition);
                  setIsDetailOpen(true);
                }}
                className="mt-4 w-full "
                variant="ghost"
              >
                Ver Detalles
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPetition && (
        <PetitionDetailDialog
          petition={selectedPetition}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          categoryName={getCategoryName(selectedPetition.idTypePetition || 0)}
        />
      )}
    </>
  );
}
