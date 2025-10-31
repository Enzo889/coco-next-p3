"use client";

import { Badge } from "@/components/ui/badge";
import { ROLES, getRoleName } from "@/types/roles";
import { Shield, ShieldCheck, User } from "lucide-react";

interface UserBadgeProps {
  group: number;
  className?: string;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ group, className }) => {
  const getRoleIcon = () => {
    switch (group) {
      case ROLES.SUPERADMIN:
        return <ShieldCheck className="h-3 w-3" />;
      case ROLES.ADMIN:
        return <Shield className="h-3 w-3" />;
      case ROLES.USER:
        return <User className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getRoleColor = () => {
    switch (group) {
      case ROLES.SUPERADMIN:
        return "bg-purple-500 hover:bg-purple-600";
      case ROLES.ADMIN:
        return "bg-blue-500 hover:bg-blue-600";
      case ROLES.USER:
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <Badge className={`${getRoleColor()} text-white gap-1 ${className}`}>
      {getRoleIcon()}
      {getRoleName(group)}
    </Badge>
  );
};
