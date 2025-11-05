"use client";

import {
  Bell,
  ContactRoundIcon,
  Home,
  LibraryBigIcon,
  MessageCircle,
  StickyNoteIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NotificationsPopover } from "./nav-notifications";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Logo } from "./icons/logo";
import DashboardNavigation, { Route } from "./nav-main";
import { ThemeToggleButton } from "./ui/skipper26";
import { INotification } from "@/types/notification.interface";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@/app/api/service";

const sampleNotifications = [
  {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "New order received.",
    time: "10m ago",
  },
  {
    id: "2",
    avatar: "/avatars/02.png",
    fallback: "JL",
    text: "Server upgrade completed.",
    time: "1h ago",
  },
  {
    id: "3",
    avatar: "/avatars/03.png",
    fallback: "HH",
    text: "New user signed up.",
    time: "2h ago",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: session, status } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const loadUnreadCount = async () => {
        try {
          const allNotifications: INotification[] =
            await api.getNotifications();
          const userNotifications = allNotifications.filter(
            (notif) => notif.idProvider === session?.user?.id
          );
          const unread = userNotifications.filter((n) => !n.viewed).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error("[v0] Error loading unread count:", error);
        }
      };

      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [status, session?.user?.id]);

  const dashboardRoutes: Route[] = [
    {
      id: "home",
      title: "Inicio",
      icon: <Home className="size-4" />,
      link: "/dashboard",
    },
    {
      id: "interest",
      title: "Mis intereses",
      icon: <LibraryBigIcon className="size-4" />,
      link: "/dashboard/interest",
    },
    {
      id: "notifications",
      title: "Notificaciones",
      icon: <Bell className="size-4" />,
      link: "/dashboard/notifications",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: "petitions",
      title: "Mis peticiones",
      icon: <StickyNoteIcon className="size-4" />,
      link: "/dashboard/petitions",
    },
    {
      id: "postulations",
      title: "Mis postulaciones",
      icon: <ContactRoundIcon className="size-4" />,
      link: "/dashboard/postulations",
    },
    {
      id: "conversations",
      title: "Mis Conversaciones",
      icon: <MessageCircle className="size-4" />,
      link: "/dashboard/chat",
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <a href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              Coco
            </span>
          )}
        </a>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <NotificationsPopover />
          <ThemeToggleButton
            className="h-6 w-6 "
            blur
            variant="rectangle"
            start="left-right"
          />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
