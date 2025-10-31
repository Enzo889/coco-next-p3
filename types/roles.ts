export enum ROLES {
  SUPERADMIN = 1,
  ADMIN = 2,
  USER = 3,
}

export const getRoleName = (group: number): string => {
  switch (group) {
    case ROLES.SUPERADMIN:
      return "Super Admin";
    case ROLES.ADMIN:
      return "Admin";
    case ROLES.USER:
      return "Usuario";
    default:
      return "Desconocido";
  }
};

export const isAdmin = (group: number): boolean => {
  return group === ROLES.SUPERADMIN || group === ROLES.ADMIN;
};

export const isSuperAdmin = (group: number): boolean => {
  return group === ROLES.SUPERADMIN;
};
