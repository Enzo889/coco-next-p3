"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { UserIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JSX, SVGProps, useState } from "react";

// Componente Logo (Mantenido del código original)
const Logo = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    fill="currentColor"
    height="48"
    viewBox="0 0 40 48"
    width="40"
    {...props}
  >
    <clipPath id="a">
      <path d="m0 0h40v48h-40z" />
    </clipPath>
    <g clipPath="url(#a)">
      <path d="m25.0887 5.05386-3.933-1.05386-3.3145 12.3696-2.9923-11.16736-3.9331 1.05386 3.233 12.0655-8.05262-8.0526-2.87919 2.8792 8.83271 8.8328-10.99975-2.9474-1.05385625 3.933 12.01860625 3.2204c-.1376-.5935-.2104-1.2119-.2104-1.8473 0-4.4976 3.646-8.1436 8.1437-8.1436 4.4976 0 8.1436 3.646 8.1436 8.1436 0 .6313-.0719 1.2459-.2078 1.8359l10.9227 2.9267 1.0538-3.933-12.0664-3.2332 11.0005-2.9476-1.0539-3.933-12.0659 3.233 8.0526-8.0526-2.8792-2.87916-8.7102 8.71026z" />
      <path d="m27.8723 26.2214c-.3372 1.4256-1.0491 2.7063-2.0259 3.7324l7.913 7.9131 2.8792-2.8792z" />
      <path d="m25.7665 30.0366c-.9886 1.0097-2.2379 1.7632-3.6389 2.1515l2.8794 10.746 3.933-1.0539z" />
      <path d="m21.9807 32.2274c-.65.1671-1.3313.2559-2.0334.2559-.7522 0-1.4806-.102-2.1721-.2929l-2.882 10.7558 3.933 1.0538z" />
      <path d="m17.6361 32.1507c-1.3796-.4076-2.6067-1.1707-3.5751-2.1833l-7.9325 7.9325 2.87919 2.8792z" />
      <path d="m13.9956 29.8973c-.9518-1.019-1.6451-2.2826-1.9751-3.6862l-10.95836 2.9363 1.05385 3.933z" />
    </g>
  </svg>
);

export default function RegisterPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);
    setLoading(true);

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      setLoading(false);
      return;
    }

    try {
      // 1. Registro del usuario en el Backend (API)
      const res = await fetch(
        // Asegúrate de que esta variable de entorno esté definida en tu proyecto
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const responseAPI = await res.json();

      if (!res.ok) {
        // Manejar errores de la API (ej. usuario ya existe, validación)
        // La API debe devolver un array de mensajes o un solo mensaje.
        const errorMessages = Array.isArray(responseAPI.message)
          ? responseAPI.message
          : [responseAPI.message || "Registration failed. Please try again."];
        setErrors(errorMessages);
        setLoading(false);
        return;
      }

      // 2. Inicio de sesión automático después del registro (NextAuth)
      const responseNextAuth = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (responseNextAuth?.error) {
        // Manejar errores de inicio de sesión de NextAuth
        setErrors(responseNextAuth.error.split(","));
        return;
      }

      // 3. Redirección al Dashboard en caso de éxito
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration/Login Error:", error);
      setErrors([
        "An unexpected error occurred. Please check your network and try again.",
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo
            className="mx-auto h-10 w-10 text-primary dark:text-primary"
            aria-hidden={true}
          />
          <h3 className="mt-4 text-center text-xl font-bold text-foreground">
            Create a New Account
          </h3>
        </div>

        <Card className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Nombre */}
              <div>
                <Label
                  htmlFor="name-register"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </Label>
                <div className="relative mt-2">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                    <UserIcon className="size-4" />
                  </div>
                  <Input
                    type="text"
                    id="name-register"
                    name="name"
                    autoComplete="name"
                    placeholder="Your Name"
                    className=" border-primary-foreground/50 peer pl-9 "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo Email */}
              <div>
                <Label
                  htmlFor="email-register"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="email-register"
                  name="email"
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  className="mt-2 border-primary-foreground/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Campo Contraseña */}
              <div>
                <Label
                  htmlFor="password-register"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  id="password-register"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Password"
                  className="mt-2 border-primary-foreground/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Campo Confirmar Contraseña */}
              <div>
                <Label
                  htmlFor="confirm-password-register"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm password
                </Label>
                <Input
                  type="password"
                  id="confirm-password-register"
                  name="confirm-password"
                  autoComplete="new-password"
                  placeholder="Password"
                  className="mt-2 border-primary-foreground/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Botón de Envío */}
              <Button
                type="submit"
                className="mt-6 w-full py-2 font-semibold cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <p>processing</p>
                    <Spinner />
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              {/* Mostrar Errores */}
              {errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  <ul className="list-disc ml-4 mb-0 space-y-1 text-sm">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm">
                        ⚠️ {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Enlaces de Políticas */}
              <p className="text-center pt-2 text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
                <a
                  href="#"
                  className="capitalize text-primary hover:text-primary/90 transition-colors"
                >
                  Terms of use
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="capitalize text-primary hover:text-primary/90 transition-colors"
                >
                  Privacy policy
                </a>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Enlace para Iniciar Sesión */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="login" // Cambiar a la ruta de inicio de sesión
            className="font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
