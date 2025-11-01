"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { INotification } from "@/types/notification.interface";
import { Card } from "@/components/ui/card";
import { api } from "@/app/api/service";
import NotificationsList from "./__components/notifications-list";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar notificaciones y configurar polling
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      loadNotifications();
    }
  }, [status, session?.user?.id]);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      // Obtener todas las notificaciones
      const allNotifications = await api.getNotifications();

      const userNotifications = allNotifications.filter(
        (notif) => notif.idProvider === session?.user?.id
      );

      setNotifications(userNotifications);

      // Contar notificaciones no vistas
      const unread = userNotifications.filter((n) => !n.viewed).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("[v0] Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsViewed = async (notificationId: number) => {
    try {
      await api.updateNotification(notificationId, { viewed: true });

      setNotifications((prev) =>
        prev.map((n) =>
          n.idNotification === notificationId ? { ...n, viewed: true } : n
        )
      );

      // Recalcular count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("[v0] Error updating notification:", error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await api.deleteNotification(notificationId);

      setNotifications((prev) =>
        prev.filter((n) => n.idNotification !== notificationId)
      );
    } catch (error) {
      console.error("[v0] Error deleting notification:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex w-[80vw] justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex w-[80vw] justify-center items-center min-h-screen">
        Por favor inicia sesión
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Notificaciones</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Tienes {unreadCount} notificación{unreadCount !== 1 ? "es" : ""}{" "}
                sin leer
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={loadNotifications}
              className="cursor-pointer"

            >
              <RefreshCw />
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No tienes notificaciones en este momento
            </p>
          </Card>
        ) : (
          <NotificationsList
            notifications={notifications}
            onMarkAsViewed={handleMarkAsViewed}
            onDelete={handleDeleteNotification}
          />
        )}
      </div>
    </div>
  );
}
