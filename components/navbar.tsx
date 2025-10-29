"use client";

import { Bell, LogOut, Menu, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Logo } from "./icons/logo";

const Navbar = () => {
  const { data: session } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo className="h-8 w-8" />
            <span className="text-base sm:text-xl font-bold text-foreground">
              Integracion Comunitaria
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => scrollToSection("inicio")}
              className="text-sm lg:text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("caracteristicas")}
              className="text-sm lg:text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Características
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-sm lg:text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo Funciona
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {session?.user.id ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden sm:flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                          <AvatarImage
                            src={session.user.name || "/placeholder.svg"}
                            alt={session.user.name}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {getUserInitials(session.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        {/* <span className="hidden lg:block text-sm font-medium text-foreground">
                          {session.user.name}
                        </span> */}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={"/dashboard"}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Inicio</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={"/dashboard/petitions"}>
                          <Bell className="mr-2 h-4 w-4" />

                          <span>Mis Peticiones</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex sm:size-default text-sm lg:text-base"
                >
                  <Link href="/login">Iniciar Sesión </Link>
                </Button>
                <Button
                  size="sm"
                  className="hidden sm:flex sm:size-default text-sm lg:text-base"
                >
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors text-left px-2 py-1"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("caracteristicas")}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors text-left px-2 py-1"
              >
                Características
              </button>
              <button
                onClick={() => scrollToSection("como-funciona")}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors text-left px-2 py-1"
              >
                Cómo Funciona
              </button>
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                {session?.user.id ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={session.user.name || "/placeholder.svg"}
                          alt={session.user.name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials(session.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-foreground">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Mis Peticiones
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                    <Button size="sm" className="w-full">
                      <Link href="/register">Registrarse</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
export default Navbar;
