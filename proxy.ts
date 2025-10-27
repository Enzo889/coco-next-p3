import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export default withAuth(
  (req: NextRequest) => {
    // opcional: lógica adicional por petición
  },
  {
    callbacks: {
      // solo permite accesos si hay token de sesión
      authorized: ({ token }) => !!token,
    },
  }
);
