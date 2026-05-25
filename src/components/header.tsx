"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Heart, LogIn, LogOut, Plus, Settings, User } from "lucide-react";

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
import { CitySelector } from "@/components/city-selector";

interface HeaderProps {
  city: string;
  onCityChange: (city: string) => void;
  favoritesCount: number;
  onCreatePost: () => void;
}

export function Header({ city, onCityChange, favoritesCount, onCreatePost }: HeaderProps) {
  // Mock auth state — replace with real session once backend integration lands.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

        <div className="ml-2 hidden md:block">
          <CitySelector city={city} onChange={onCityChange} />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
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

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Favoritos"
          >
            <Heart className="h-5 w-5" />
            {favoritesCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {favoritesCount}
              </span>
            )}
          </Button>

          {isLoggedIn && (
            <Button variant="ghost" size="icon" aria-label="Notificaciones">
              <Bell className="h-5 w-5" />
            </Button>
          )}

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                  aria-label="Menú de usuario"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://i.pravatar.cc/100?img=12" alt="" />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">Mi cuenta</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      usuario@flitrhub.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsLoggedIn(false)}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setIsLoggedIn(true)}
                className="hidden sm:inline-flex"
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Button>
              <Button variant="brand">Crear cuenta</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
