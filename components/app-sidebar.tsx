"use client";

import {
  Bell,
  ContactRoundIcon,
  Home,
  LibraryBigIcon,
  MessageCircle,
  StickyNoteIcon,
  Menu,
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
import { useChat } from "@/hooks/useChat";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: session, status } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const { totalUnread, loadConversations } = useChat({
    socket: null,
    currentUserId: session?.user?.id || null,
  });

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

      loadConversations();

      const intervalConversation = setInterval(loadConversations, 10000);

      loadUnreadCount();
      const intervalNotification = setInterval(loadUnreadCount, 5000);

      return () => {
        clearInterval(intervalConversation);
        clearInterval(intervalNotification);
      };
    }
  }, [status, session?.user?.id, loadConversations]);

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
      title: "Postulaciones",
      icon: <ContactRoundIcon className="size-4" />,
      link: "/dashboard/postulations",
    },
    {
      id: "conversations",
      title: "Mis Conversaciones",
      icon: <MessageCircle className="size-4" />,
      link: "/dashboard/chat",
      badge: totalUnread > 0 ? totalUnread : undefined,
    },
  ];

  return (
    <>
      {/* Sidebar para escritorio */}
      <Sidebar
        variant="floating"
        collapsible="icon"
        className="hidden md:block"
      >
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

      {/* Sidebar para mobile */}
      <div className="md:hidden w-full flex justify-end items-center px-4 py-6  absolute ">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Menú</SheetTitle>
            </SheetHeader>
            <div className="p-4 flex flex-col gap-4">
              <DashboardNavigation routes={dashboardRoutes} />
              <div className="mt-auto">
                <NavUser />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
