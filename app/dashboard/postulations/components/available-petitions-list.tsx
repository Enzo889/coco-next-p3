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
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AvailablePetitionsListProps {
  petitions: IPetition[];
  categories: INCategory[];
}

const ITEMS_PER_PAGE = 5;

export default function AvailablePetitionsList({
  petitions,
  categories,
}: AvailablePetitionsListProps) {
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredPetitions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPetitions = filteredPetitions.slice(startIndex, endIndex);

  const MAX_VISIBLE_PAGES = 6;
  const getVisiblePages = () => {
    const halfWindow = Math.floor(MAX_VISIBLE_PAGES / 2);
    let startPage = Math.max(1, currentPage - halfWindow);
    const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    // Si estamos cerca del final, ajustar el inicio para siempre mostrar 6 páginas
    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const visiblePages = getVisiblePages();

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex   gap-2 mb-4">
        <Select
          onValueChange={(value) => handleFilterChange(value)}
          value={filter}
        >
          <SelectTrigger className="w-[200px] ">
            <SelectValue placeholder="Elije la Categoria" />
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
        <Button onClick={() => handleFilterChange("")}>Limpiar</Button>
      </div>

      {paginatedPetitions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No hay peticiones disponibles en este momento
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paginatedPetitions.map((petition) => (
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

      <div className="flex items-center justify-between mt-6 border rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          {startIndex + 1} a {Math.min(endIndex, filteredPetitions.length)} de{" "}
          {filteredPetitions.length} peticiones
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          <div className="flex items-center gap-2">
            {visiblePages.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
