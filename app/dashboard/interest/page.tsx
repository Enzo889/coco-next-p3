"use client";
import { api } from "@/app/api/service";
import type { INCategory } from "@/types/category.interface";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InterestSelector } from "./__component/interest-selector";
import { Spinner } from "@/components/ui/spinner";

function InterestPage() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<INCategory[] | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        if (mounted) setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
        if (mounted) setCategories([]);
      } finally {
        if (mounted) setLoadingCategories(false);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen w-[80vw] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Por favor inicia sesión</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Selecciona tus intereses
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Elige las categorías que te interesan para personalizar tu
              experiencia
            </p>
          </div>

          {/* Interest Selector */}
          {categories && categories.length > 0 ? (
            <InterestSelector
              categories={categories}
              userId={session.user.id || 0}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay categorías disponibles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterestPage;
