"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  EyeOff,
  Heart,
  LogIn,
  LogOut,
  MessageSquare,
  Plus,
  Repeat,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader as DialogHeaderUi,
  DialogTitle,
} from "@/components/ui/dialog";
import { CitySelector } from "@/components/city-selector";
import { LoginDialog } from "@/components/login-dialog";
import { useSession } from "@/lib/session";
import { useChat } from "@/lib/chat-context";
import { useDiscreet } from "@/lib/discreet";
import { cn } from "@/lib/utils";

interface HeaderProps {
  city?: string;
  onCityChange?: (city: string) => void;
  favoritesCount?: number;
  onCreatePost?: () => void;
}

export function Header({
  city,
  onCityChange,
  favoritesCount = 0,
  onCreatePost,
}: HeaderProps = {}) {
  const { user, isLoggedIn, logout, switchRole } = useSession();
  const { chats } = useChat();
  const { enabled: discreet, toggle: toggleDiscreet } = useDiscreet();
  const totalUnread = chats.reduce((n, c) => n + c.unread, 0);
  const [loginOpen, setLoginOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const showCity = city !== undefined && onCityChange !== undefined;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            F
          </div>
          <span className="hidden text-xl font-bold tracking-tight text-brand sm:inline">
            flitr<span className="text-primary">hub</span>
          </span>
        </Link>

        {showCity && (
          <div className="ml-2 hidden md:block">
            <CitySelector city={city!} onChange={onCityChange!} />
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {onCreatePost && (
            <>
              <Button
                variant="brand"
                size="sm"
                onClick={onCreatePost}
                className="hidden gap-1.5 sm:inline-flex"
              >
                <Plus className="h-4 w-4" />
                Publicar
              </Button>
              <Button
                variant="brand"
                size="icon"
                onClick={onCreatePost}
                aria-label="Crear publicación"
                className="sm:hidden"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </>
          )}

          <Button
            variant={discreet ? "default" : "ghost"}
            size="icon"
            onClick={toggleDiscreet}
            aria-label={discreet ? "Desactivar modo discreto" : "Activar modo discreto"}
            title={discreet ? "Modo discreto: ON" : "Modo discreto"}
            className={cn(
              "relative",
              discreet &&
                "ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
            )}
          >
            {discreet ? (
              <ShieldCheck className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
            {discreet && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-background" />
            )}
          </Button>

          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Centro de chat">
            <Link href="/chat" target="_blank" rel="noopener">
              <MessageSquare className="h-5 w-5" />
              {totalUnread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {totalUnread}
                </span>
              )}
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Favoritos">
            <Link href="/profile">
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {favoritesCount}
                </span>
              )}
            </Link>
          </Button>

          {isLoggedIn && (
            <Button variant="ghost" size="icon" aria-label="Notificaciones">
              <Bell className="h-5 w-5" />
            </Button>
          )}

          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                  aria-label="Menú de usuario"
                >
                  <Avatar className="no-blur h-10 w-10">
                    <AvatarImage src={user.avatar} alt="" />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute -right-0.5 -bottom-0.5 inline-flex h-4 items-center justify-center rounded-full px-1 text-[8px] font-bold uppercase ring-2 ring-background",
                      user.role === "provider"
                        ? "bg-gradient-gold text-amber-950"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {user.role === "provider" ? "Anun" : "Cli"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80 overflow-hidden p-0"
                align="end"
              >
                {/* Hero header */}
                <div className="bg-gradient-sensual relative overflow-hidden px-4 pb-4 pt-5">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
                  <div className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />

                  <div className="relative flex items-start gap-3">
                    <Avatar className="no-blur h-14 w-14 ring-2 ring-white/30">
                      <AvatarImage src={user.avatar} alt="" />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-sm font-bold text-white">
                          {user.name}
                        </p>
                        <BadgeCheck className="h-4 w-4 shrink-0 fill-sky-400 text-white" />
                      </div>
                      <p className="truncate text-xs text-white/70">
                        {user.email}
                      </p>
                      <span
                        className={cn(
                          "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          user.role === "provider"
                            ? "bg-gradient-gold text-amber-950"
                            : "bg-white/15 text-white backdrop-blur"
                        )}
                      >
                        {user.role === "provider" ? (
                          <Sparkles className="h-3 w-3" />
                        ) : (
                          <Heart className="h-3 w-3" />
                        )}
                        {user.role === "provider"
                          ? "Cuenta anunciante"
                          : "Cuenta cliente"}
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full justify-between border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
                  >
                    <Link href="/profile">
                      Ver mi perfil
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  <DropdownMenuItem asChild className="cursor-pointer gap-2.5 py-2">
                    <Link href="/settings">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground">
                        <Settings className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 text-sm">Configuración</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={switchRole}
                    className="cursor-pointer gap-2.5 py-2"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Repeat className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm">
                        Cambiar a{" "}
                        {user.role === "provider" ? "cliente" : "anunciante"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {user.role === "provider"
                          ? "Explora perfiles como cliente"
                          : "Publica y ofrece servicios"}
                      </p>
                    </div>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-0" />

                <div className="p-1.5">
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setLogoutOpen(true);
                    }}
                    className="cursor-pointer gap-2.5 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                      <LogOut className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm">Cerrar sesión</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setLoginOpen(true)}
                className="hidden sm:inline-flex"
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Button>
              <Button asChild variant="brand">
                <Link href="/signup">Crear cuenta</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeaderUi>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <LogOut className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center">
              ¿Cerrar sesión?
            </DialogTitle>
            <DialogDescription className="text-center">
              Tendrás que volver a iniciar sesión para acceder a tu cuenta,
              favoritos y conversaciones.
            </DialogDescription>
          </DialogHeaderUi>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setLogoutOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setLogoutOpen(false);
                logout();
              }}
              className="flex-1 gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
