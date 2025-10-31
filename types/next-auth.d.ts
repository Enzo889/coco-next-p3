import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    name: string;
    group: number; // 1=SUPERADMIN, 2=ADMIN, 3=USER
    token: string;
  }

  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      group: number;
    };
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string;
    name: string;
    group: number;
    accessToken: string;
  }
}
