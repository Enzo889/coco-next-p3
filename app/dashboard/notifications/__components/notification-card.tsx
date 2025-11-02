"use client";

import type { INotification } from "@/types/notification.interface";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { useState } from "react";
import { TYPE_PETITION } from "@/types/type_petition.enum";
import { useRouter } from "next/navigation";

interface NotificationCardProps {
  notification: INotification;
  onMarkAsViewed: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  petitionId?: number;
}

export default function NotificationCard({
  notification,
  onMarkAsViewed,
  onDelete,
  petitionId,
}: NotificationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const router = useRouter();

  const handleMarkAsViewed = async () => {
    setIsMarking(true);
    try {
      await onMarkAsViewed(notification.idNotification || 0);
    } finally {
      setIsMarking(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(notification.idNotification || 0);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNavigateToPetition = () => {
    if (petitionId) {
      router.push(`/dashboard/postulations/${petitionId}`);
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeInfo = (type: string | null) => {
    switch (type) {
      case TYPE_PETITION.newPetition:
        return {
          label: "Nueva Petición",
          color: "bg-blue-500 border-blue-200",
          textColor: "text-blue-500 dark:text-blue-50",
        };
      case TYPE_PETITION.newPostulation:
        return {
          label: "Nueva Postulación",
          color: "bg-green-500 border-green-200",
          textColor: "text-green-500 dark:text-green-50",
        };
      case TYPE_PETITION.petitionSelected:
        return {
          label: "Postulación Aceptada",
          color: "bg-emerald-50 border-emerald-200",
          textColor: "text-emerald-500 dark:text-emerald-50",
        };
      case TYPE_PETITION.petitionRejected:
        return {
          label: "Postulación Rechazada",
          color: "bg-red-500 border-red-200",
          textColor: "text-red-500 dark:text-red-50",
        };
      default:
        return {
          label: "Notificación",
          color: "bg-gray-500 border-gray-200",
          textColor: "text-gray-500 dark:text-gray-50",
        };
    }
  };

  const typeInfo = getTypeInfo(notification.type);

  return (
    <Card
      className={`p-4 border-l-4 transition-all ${
        notification.viewed
          ? "bg-muted/30 opacity-75"
          : `${typeInfo.color} border-l-blue-500`
      } ${petitionId ? "cursor-pointer hover:shadow-md" : ""}`}
      onClick={petitionId ? handleNavigateToPetition : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {notification.viewed ? (
              <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-primary fill-primary shrink-0" />
            )}
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${typeInfo.textColor}`}
            >
              {typeInfo.label}
            </span>
          </div>

          <p
            className={`text-sm ${
              notification.viewed
                ? "text-muted-foreground"
                : "text-foreground font-medium"
            }`}
          >
            {notification.message}
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            {formatDate(notification.dateCreate)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {petitionId && (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          {!notification.viewed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsViewed();
              }}
              disabled={isMarking}
              className="cursor-pointer"
              title="Marcar como leída"
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
