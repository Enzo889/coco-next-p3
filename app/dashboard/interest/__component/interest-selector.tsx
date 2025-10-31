"use client";

import { useState, useEffect } from "react";
import type { INCategory } from "@/types/category.interface";
import { api } from "@/app/api/service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface InterestSelectorProps {
  categories: INCategory[];
  userId: number;
}

export function InterestSelector({
  categories,
  userId,
}: InterestSelectorProps) {
  const [selectedInterests, setSelectedInterests] = useState<Set<number>>(
    new Set()
  );
  const [loadingInterests, setLoadingInterests] = useState<Set<number>>(
    new Set()
  );
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Cargar intereses del usuario al montar el componente
  useEffect(() => {
    const fetchUserInterests = async () => {
      try {
        const userInterests = await api.getUserInterests();
        const selectedIds = new Set(
          userInterests.map((interest) => interest.idCategory)
        );
        setSelectedInterests(selectedIds);
      } catch (error) {
        console.error("Error loading user interests:", error);
        toast.error("Error", {
          description: "No se pudieron cargar tus intereses",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchUserInterests();
  }, [toast]);

  const toggleInterest = async (categoryId: number) => {
    const isSelected = selectedInterests.has(categoryId);

    // Agregar a loading
    setLoadingInterests((prev) => new Set(prev).add(categoryId));

    try {
      if (isSelected) {
        // Deseleccionar: encontrar el userInterest y eliminarlo
        const userInterests = await api.getUserInterests();
        const interestToRemove = userInterests.find(
          (interest) => interest.idCategory === categoryId
        );

        if (interestToRemove?.idUserInterest) {
          await api.removeUserInterest(interestToRemove.idUserInterest);
          setSelectedInterests((prev) => {
            const newSet = new Set(prev);
            newSet.delete(categoryId);
            return newSet;
          });

          toast.warning(" Interes Eliminado", {
            description: "La categoría ha sido removida de tus intereses",
          });
        }
      } else {
        // Seleccionar: crear nuevo userInterest
        await api.addUserInterest({
          idUser: userId,
          idCategory: categoryId,
        });

        setSelectedInterests((prev) => new Set(prev).add(categoryId));

        toast.success("Interes Agregado", {
          description: "La categoría ha sido añadida a tus intereses",
        });
      }
    } catch (error) {
      console.error("Error toggling interest:", error);
      toast.error("Error ", {
        description: "No se pudo actualizar el interés",
      });
    } finally {
      // Remover de loading
      setLoadingInterests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen w-[80vw] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contador de intereses seleccionados */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-sm">
          {selectedInterests.size}{" "}
          {selectedInterests.size === 1 ? "interés" : "intereses"} seleccionado
          {selectedInterests.size !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Grid de categorías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isSelected = selectedInterests.has(category.idCategory);
          const isLoading = loadingInterests.has(category.idCategory);

          return (
            <Card
              key={category.idCategory}
              className={cn(
                "relative overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "hover:border-primary/50"
              )}
              onClick={() => !isLoading && toggleInterest(category.idCategory)}
            >
              <div className="p-6 space-y-4">
                {/* Indicador de selección */}
                <div className="flex items-start justify-between text-pretty">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-pretty ">
                      {category.name}
                    </h3>
                  </div>
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isLoading ? (
                      <Spinner />
                    ) : isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : null}
                  </div>
                </div>

                {/* Botón de acción */}
                <Button
                  variant={isSelected ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleInterest(category.idCategory);
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      Procesando...
                    </>
                  ) : isSelected ? (
                    "Remover"
                  ) : (
                    "Agregar"
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
