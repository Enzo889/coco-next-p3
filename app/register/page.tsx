"use client";

import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      setErrors(["Las contraseñas no coinciden."]);
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
          : [
              responseAPI.message ||
                "Registro fallido. Por favor, inténtalo de nuevo.",
            ];
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
        "Ocurrió un error inesperado. Comprueba tu conexión e inténtalo de nuevo.",
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
            Crear una nueva cuenta
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
                  Nombre
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
                    placeholder="Tu nombre"
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
                  Correo electrónico
                </Label>
                <div className="relative mt-2">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                    <MailIcon className="size-4" />
                  </div>
                  <Input
                    type="email"
                    id="email-register"
                    name="email"
                    autoComplete="email"
                    placeholder="tu.email@ejemplo.com"
                    className=" border-primary-foreground/50 peer pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <Label
                  htmlFor="password-register"
                  className="text-sm font-medium text-foreground"
                >
                  Contraseña
                </Label>

                <div className="relative mt-2">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                    <LockIcon className="size-4" />
                  </div>
                  <Input
                    type="password"
                    id="password-register"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Contraseña"
                    className=" border-primary-foreground/50 peer pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo Confirmar Contraseña */}
              <div>
                <Label
                  htmlFor="confirm-password-register"
                  className="text-sm font-medium text-foreground"
                >
                  Confirmar contraseña
                </Label>

                <div className="relative mt-2">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                    <LockIcon className="size-4" />
                  </div>
                  <Input
                    type="password"
                    id="confirm-password-register"
                    name="confirm-password"
                    autoComplete="new-password"
                    placeholder="Contraseña"
                    className=" border-primary-foreground/50 peer pl-9"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Botón de Envío */}
              <Button
                type="submit"
                className="mt-6 w-full py-2 font-semibold cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <p>procesando</p>
                    <Spinner />
                  </>
                ) : (
                  "Crear cuenta"
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
                Al registrarte, aceptas nuestros{" "}
                <a
                  href="#"
                  className="capitalize text-primary hover:text-primary/90 transition-colors"
                >
                  Términos de uso
                </a>{" "}
                y{" "}
                <a
                  href="#"
                  className="capitalize text-primary hover:text-primary/90 transition-colors"
                >
                  Política de privacidad
                </a>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Enlace para Iniciar Sesión */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <a
            href="login" // Cambiar a la ruta de inicio de sesión
            className="font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
