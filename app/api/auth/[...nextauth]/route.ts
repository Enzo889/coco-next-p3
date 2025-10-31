import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Error al iniciar sesión");
        }

        const user = await res.json();

        // El backend ya retorna: { token, email, group, name, id }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          group: user.group, // ROLES: 1=SUPERADMIN, 2=ADMIN, 3=USER
          token: user.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id =
          typeof user.id === "string" ? (Number(user.id) as number) : user.id;
        token.email = user.email;
        token.name = user.name;
        token.group =
          typeof user.group === "string"
            ? (Number(user.group) as number)
            : user.group;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: Number(token.id) as number,
        email: token.email as string,
        name: token.name as string,
        group: Number(token.group) as number,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
