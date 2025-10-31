"use client";

import { useSession } from "next-auth/react";
import { ROLES, isAdmin, isSuperAdmin } from "@/types/roles";

export const useRole = () => {
  const { data: session } = useSession();

  return {
    group: session?.user?.group || ROLES.USER,
    isUser: session?.user?.group === ROLES.USER,
    isAdmin: session?.user?.group ? isAdmin(session.user.group) : false,
    isSuperAdmin: session?.user?.group
      ? isSuperAdmin(session.user.group)
      : false,
    hasRole: (role: ROLES) => session?.user?.group === role,
  };
};
