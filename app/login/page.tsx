"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockIcon, MailIcon } from "lucide-react";
import { Metadata } from "next";

export default function LoginPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">
                Bienvenido de nuevo 👋
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-muted-foreground">
                Introduce tus datos para acceder a tu cuenta.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <Label
                    htmlFor="email-login-03"
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
                      id="email-login-03"
                      name="email"
                      autoComplete="email"
                      placeholder="tu@correo.aqui"
                      className=" border-primary-foreground/50 peer pl-9 "
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="password-login-03"
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
                      id="password-login-03"
                      name="password"
                      autoComplete="current-password"
                      placeholder="contraseña"
                      className="border-primary-foreground/50 peer pl-9"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-6 w-full py-2 font-semibold cursor-pointer"
                >
                  Iniciar sesión
                </Button>
              </form>

              {errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  <ul className="list-disc ml-4 mb-0 space-y-1 text-sm">
                    {errors.map((error) => (
                      <li key={error}>Error: {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <p className="w-full text-center text-sm text-muted-foreground">
                ¿Olvidaste tu contraseña?{" "}
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Restablecer contraseña
                </a>
              </p>
              <p className="w-full text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <a
                  href="register"
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Regístrate
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
