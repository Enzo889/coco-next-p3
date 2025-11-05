"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Briefcase,
  Users,
  ArrowRight,
  Clock,
  MessageSquare,
  Eye,
  DollarSign,
  Zap,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { api } from "@/app/api/service";
import type { IPetition } from "@/types/petition.interface";
import type { INotification } from "@/types/notification.interface";
import { useSession } from "next-auth/react";
import { IPostulation } from "@/types/postulation.interface";
import { getPetitionTitle } from "@/lib/utils";

export default function HomePage() {
  const [petitions, setPetitions] = useState<IPetition[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [postulations, setPostulations] = useState<IPostulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get petitions
        const petitionsData = await api.getPetitions();
        setPetitions(petitionsData);

        // Get notifications
        const notificationsData = await api.getNotifications();
        setNotifications(notificationsData);

        // Get postulations
        const postulationsData = await api.getPostulations();
        setPostulations(postulationsData);

        setLoading(false);
      } catch (err) {
        console.error("[v0] Error fetching homepage data:", err);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const myPetitions = session?.user.id
    ? petitions
        .filter((p: IPetition) => p.idUserCreate === session?.user.id)
        .slice(0, 3)
    : [];

  const unreadNotifications = session?.user.id
    ? notifications.filter(
        (n: INotification) => !n.viewed && n.idProvider === session?.user.id
      )
    : [];

  const recentActivities = session?.user.id
    ? notifications
        .filter((n: INotification) => n.idProvider === session?.user.id)
        .slice(0, 4)
    : [];

  const activeProjectsCount = myPetitions.filter(
    (p: IPetition) => p.idState === 1
  ).length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalPostulationsReceived = postulations.filter((post: any) => {
    const petitionForPost = petitions.find(
      (p: IPetition) => p.idPetition === post.idPetition
    );
    return petitionForPost?.idUserCreate === session?.user.id;
  }).length;

  const successRate = 92;

  const availableOpportunities = petitions
    .filter(
      (p: IPetition) => p.idUserCreate !== session?.user.id && p.idState === 1
    )
    .slice(0, 3);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-center text-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div>
              <h1 className="text-3xl   sm:text-4xl font-bold text-pretty ">
                ¡Bienvenido de nuevo!{" "}
                <span className="capitalize">
                  &quot;{session?.user.name}&quot; 👋{" "}
                </span>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Aquí está un resumen de tu actividad
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/petitions">
                <Button>
                  <Zap className="mr-2 h-4 w-4" />
                  Crear Petición
                </Button>
              </Link>
              <Link href="/dashboard/postulations">
                <Button variant="ghost">Explorar Oportunidades</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Stats Grid - 4 columns */}
          <section>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {/* Proyectos Activos */}
              <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Proyectos Activos
                    </p>
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <p className="text-2xl sm:text-3xl font-bold">
                        {activeProjectsCount}
                      </p>
                    )}
                  </div>
                  <Briefcase className="h-5 w-5 text-blue-500" />
                </div>
              </Card>

              {/* Postulaciones Recibidas */}
              <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Postulaciones Recibidas
                    </p>
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <p className="text-2xl sm:text-3xl font-bold">
                        {totalPostulationsReceived}
                      </p>
                    )}
                  </div>
                  <Users className="h-5 w-5 text-green-500" />
                </div>
              </Card>

              {/* Notificaciones No Leídas */}
              <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Notificaciones
                    </p>
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <p className="text-2xl sm:text-3xl font-bold">
                        {unreadNotifications.length}
                      </p>
                    )}
                  </div>
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                </div>
              </Card>

              {/* Tasa de Éxito */}
              <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Tasa de Éxito
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold">
                      {successRate}%
                    </p>
                  </div>
                  <Eye className="h-5 w-5 text-purple-500" />
                </div>
              </Card>
            </div>
          </section>

          {/* Bento Grid Layout */}
          <section>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
              {/* Large card - Mis Peticiones */}
              <div className="lg:col-span-2 lg:row-span-2">
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold">
                        Mis Peticiones
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Proyectos activos y solicitudes
                      </p>
                    </div>
                    <Link href="/dashboard/petitions">
                      <Button variant="ghost" size="sm">
                        Ver Todo <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3 flex-1">
                    {loading ? (
                      [...Array(2)].map((_, i) => (
                        <div
                          key={i}
                          className="border border-border rounded-lg p-4 space-y-2"
                        >
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ))
                    ) : myPetitions.length > 0 ? (
                      myPetitions.map((petition: IPetition) => (
                        <Link
                          key={petition.idPetition}
                          href={`/dashboard/postulations/${petition.idPetition}`}
                        >
                          <div className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                                    {petition.description}
                                  </h3>
                                  <Badge className="bg-blue-500 text-white text-xs">
                                    {petition.idState === 1
                                      ? "Activa"
                                      : "Completada"}
                                  </Badge>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground">
                                  {petition.dateSince && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>
                                        Desde{" "}
                                        {new Date(
                                          petition.dateSince
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-8 text-center">
                        <div className="space-y-2">
                          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                          <p className="text-muted-foreground text-sm">
                            No tienes peticiones activas
                          </p>
                          <Link href="/dashboard/petitions">
                            <Button size="sm" className="mt-2">
                              Crear Petición
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Small card - Actividad Reciente */}
              <div className="lg:row-span-2">
                <Card className="p-6 h-full flex flex-col">
                  <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
                  <div className="space-y-3 flex-1">
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="pb-3 border-b border-border space-y-2"
                        >
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      ))
                    ) : recentActivities.length > 0 ? (
                      recentActivities.map((activity: INotification) => (
                        <Link
                          key={activity.idNotification}
                          href="/dashboard/notifications"
                        >
                          <div className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0 cursor-pointer hover:opacity-75 transition-opacity">
                            <div className="shrink-0 mt-1">
                              <MessageSquare className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm line-clamp-1">
                                {getPetitionTitle(activity.type)}{" "}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {activity.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {activity.dateCreate
                                  ? new Date(
                                      activity.dateCreate
                                    ).toLocaleDateString()
                                  : "Recientemente"}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-6 text-center">
                        <p className="text-muted-foreground text-xs">
                          Sin actividad reciente
                        </p>
                      </div>
                    )}
                  </div>
                  <Link href="/dashboard/notifications" className="mt-4">
                    <Button
                      variant="ghost"
                      className="w-full text-xs sm:text-sm bg-transparent"
                      size="sm"
                    >
                      Ver Todo
                    </Button>
                  </Link>
                </Card>
              </div>

              {/* Medium card - Tasa de Éxito */}
              <Card className="p-6 lg:col-span-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                      Tasa de Éxito
                    </p>
                  </div>
                  <p className="text-3xl font-bold">{successRate}%</p>
                  <p className="text-xs text-muted-foreground">
                    En los últimos 30 días
                  </p>
                </div>
              </Card>

              {/* Medium card - Peticiones Completadas */}
              <Card className="p-6 lg:col-span-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                      Peticiones Completadas
                    </p>
                  </div>
                  {loading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-3xl font-bold">
                      {
                        petitions.filter((p: IPetition) => p.idState !== 1)
                          .length
                      }
                    </p>
                  )}
                  <p className="text-xs text-green-600">+10% este mes</p>
                </div>
              </Card>

              {/* Medium card - Oportunidades */}
              <Card className="p-6 lg:col-span-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <p className="text-muted-foreground text-xs sm:text-sm font-medium">
                      Oportunidades
                    </p>
                  </div>
                  {loading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-3xl font-bold">
                      {availableOpportunities.length}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Disponibles para ti
                  </p>
                </div>
              </Card>
            </div>
          </section>

          {/* Oportunidades Destacadas - Full width */}
          <section className="border-t border-border pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Oportunidades para Ti</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Proyectos que puedes completar
                </p>
              </div>
              <Link href="/dashboard/postulations">
                <Button variant="ghost" size="sm">
                  Explorar Todas <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-5">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-3 w-32" />
                  </Card>
                ))}
              </div>
            ) : availableOpportunities.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {availableOpportunities.map((opp: IPetition) => (
                  <Link
                    key={opp.idPetition}
                    href={`/dashboard/postulations/${opp.idPetition}`}
                  >
                    <Card className="p-5 hover:shadow-lg hover:border-primary/50 transition-all group cursor-pointer h-full">
                      <div className="space-y-4">
                        <div>
                          <Badge variant="secondary" className="mb-2 text-xs">
                            Oportunidad
                          </Badge>
                          <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2">
                            {opp.description}
                          </h3>
                        </div>

                        <div className="space-y-2 border-t border-border pt-3">
                          {opp.dateSince && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>
                                {new Date(opp.dateSince).toLocaleDateString()}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>ID Petición: {opp.idPetition}</span>
                          </div>
                        </div>

                        <Button className="w-full" size="sm" variant="default">
                          Ver Detalles
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-8">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No hay oportunidades disponibles en este momento
                  </p>
                </div>
              </Card>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
