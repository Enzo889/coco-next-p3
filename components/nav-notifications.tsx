"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { INotification } from "@/types/notification.interface";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { api } from "@/app/api/service";
import { useSession } from "next-auth/react";

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await api.getNotifications();
        const recentNotifications = data
          .filter((n) => !n.viewed)
          .sort(
            (a, b) =>
              new Date(b.dateCreate!).getTime() -
              new Date(a.dateCreate!).getTime()
          )
          .slice(0, 5);
        setNotifications(recentNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (
    notificationId: number | undefined
  ) => {
    if (!notificationId) return;
    try {
      await api.updateNotification(notificationId, { viewed: true });
      setNotifications((prev) =>
        prev.filter((n) => n.idNotification !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as viewed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative"
          aria-label="Open notifications"
        >
          <BellIcon className="size-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-80 my-6">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem
            disabled
            className="text-center text-sm text-muted-foreground"
          >
            Cargando notificaciones...
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem
            disabled
            className="text-center text-sm text-muted-foreground"
          >
            No tienes notificaciones nuevas
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.idNotification}
              className="flex items-start gap-3 cursor-pointer"
              onClick={() =>
                handleNotificationClick(notification.idNotification)
              }
            >
              <Avatar className="size-8 flex-shrink-0">
                <AvatarFallback>
                  {notification.type?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">
                  {notification.message}
                </span>
                <span className="text-xs text-muted-foreground">
                  {notification.dateCreate
                    ? formatDistanceToNow(new Date(notification.dateCreate), {
                        addSuffix: true,
                        locale: es,
                      })
                    : "Hace poco"}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm text-muted-foreground hover:text-primary">
          <Link href={"/notifications"}>Mirar todas las notificaciones</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
