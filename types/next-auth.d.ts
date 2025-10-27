import "next-auth";

declare module "next-auth" {
  export interface Session {
    user: {
      email: string;
      token: string;
      name: string;
      id: number;
    };
  }
}
