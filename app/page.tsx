"use client";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, CheckCircle2, Users } from "lucide-react";

export default function HomePage() {


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section
        id="inicio"
        className="relative overflow-hidden border-b border-border"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-32">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="flex flex-col gap-3 sm:gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-balance">
                  Conecta peticiones con personas
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty">
                  Crea peticiones y encuentra a las personas perfectas para
                  realizarlas. Notificaciones inteligentes basadas en intereses
                  para conectar lo que necesitas con quien puede hacerlo.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button size="lg" className="text-base w-full sm:w-auto">
                  Crear Petición
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base bg-transparent w-full sm:w-auto"
                >
                  Explorar Peticiones
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
                <div className="flex flex-col gap-1">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    2.5k+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Peticiones activas
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    98%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Tasa de éxito
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    10k+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Usuarios activos
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
                      Crea tu petición
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Describe lo que necesitas y establece tus requisitos.
                      Nuestro sistema encontrará a las personas ideales.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
                      Notificaciones inteligentes
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Recibe alertas de peticiones que coinciden con tus
                      intereses y habilidades automáticamente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-card-foreground">
                      Postúlate y conecta
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Aplica a las peticiones que te interesan y comienza a
                      colaborar con otros usuarios de inmediato.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="caracteristicas"
        className="py-12 sm:py-16 lg:py-20 xl:py-24 border-b border-border"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance">
              Características principales
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
              Todo lo que necesitas para conectar peticiones con personas
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                  Crea tu petición
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Describe lo que necesitas y establece tus requisitos. Nuestro
                  sistema encontrará a las personas ideales.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                  Notificaciones inteligentes
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Recibe alertas de peticiones que coinciden con tus intereses y
                  habilidades automáticamente.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-primary/10 p-3 w-fit">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">
                  Postúlate y conecta
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Aplica a las peticiones que te interesan y comienza a
                  colaborar con otros usuarios de inmediato.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl text-balance">
              Cómo funciona
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
              Tres simples pasos para conectar peticiones con personas
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl sm:text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                Publica tu petición
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Describe lo que necesitas con detalles claros y específicos
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl sm:text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                Recibe postulaciones
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Usuarios interesados reciben notificaciones y se postulan
              </p>
            </div>

            <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl sm:text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                Conecta y colabora
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Elige al candidato ideal y comienza a trabajar juntos
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
