"use client";

import type { INotification } from "@/types/notification.interface";
import NotificationCard from "./notification-card";

interface NotificationsListProps {
  notifications: INotification[];
  onMarkAsViewed: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function NotificationsList({
  notifications,
  onMarkAsViewed,
  onDelete,
}: NotificationsListProps) {
  const sortedNotifications = [...notifications].sort((a, b) => {
    const dateA = new Date(a.dateCreate || 0).getTime();
    const dateB = new Date(b.dateCreate || 0).getTime();
    return dateB - dateA;
  });

  const unviewedNotifications = sortedNotifications.filter((n) => !n.viewed);
  const viewedNotifications = sortedNotifications.filter((n) => n.viewed);

  return (
    <div className="space-y-6">
      {unviewedNotifications.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Sin leer
          </h2>
          {unviewedNotifications.map((notification) => (
            <NotificationCard
              key={notification.idNotification}
              notification={notification}
              onMarkAsViewed={onMarkAsViewed}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {viewedNotifications.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Leídas
          </h2>
          {viewedNotifications.map((notification) => (
            <NotificationCard
              key={notification.idNotification}
              notification={notification}
              onMarkAsViewed={onMarkAsViewed}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
