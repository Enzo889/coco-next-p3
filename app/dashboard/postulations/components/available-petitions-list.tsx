"use client";

import { useState } from "react";
import Link from "next/link";
import type { IPetition } from "@/types/petition.interface";
import type { INCategory } from "@/types/category.interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AvailablePetitionsListProps {
  petitions: IPetition[];
  categories: INCategory[];
}

export default function AvailablePetitionsList({
  petitions,
  categories,
}: AvailablePetitionsListProps) {
  const [filter, setFilter] = useState<string>("");

  const getCategoryName = (idCategory: number) => {
    return (
      categories.find((c) => c.idCategory === idCategory)?.name ||
      "Sin categoría"
    );
  };

  const filteredPetitions = petitions.filter((petition) => {
    if (!filter) return true;
    return petition.idCategory?.toString() === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex   gap-2 mb-4">
        <Select onValueChange={(value) => setFilter(value)} value={filter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category.idCategory}
                value={category.idCategory.toString()}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setFilter("")}>Limpiar</Button>
      </div>

      {filteredPetitions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No hay peticiones disponibles en este momento
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPetitions.map((petition) => (
            <Card
              key={petition.idPetition}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Petición #{petition.idPetition}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Categoría: {getCategoryName(petition.idCategory || 0)}
                  </p>
                  <p className="mb-4 line-clamp-2">{petition.description}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>
                      Desde:{" "}
                      {petition.dateSince
                        ? new Date(petition.dateSince).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span>
                      Hasta:{" "}
                      {petition.dateUntil
                        ? new Date(petition.dateUntil).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <Link href={`/dashboard/postulations/${petition.idPetition}`}>
                  <Button>Ver Detalles</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
