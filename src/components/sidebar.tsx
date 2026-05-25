"use client";

import { cn } from "@/lib/utils";
import { services, type ServiceKey } from "@/lib/services";
import { AdSidebarBlock } from "@/components/ads";

interface SidebarProps {
  active: ServiceKey;
  onSelect: (key: ServiceKey) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 top-16 z-30 hidden w-72 shrink-0 border-r bg-background md:block">
      <nav className="flex h-[calc(100vh-4rem)] flex-col gap-1 overflow-y-auto p-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Servicios
        </p>
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = active === service.key;
          return (
            <button
              key={service.key}
              type="button"
              onClick={() => onSelect(service.key)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-accent"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  isActive
                    ? "border-primary/30 bg-primary/15 text-primary"
                    : "border-border bg-muted/40 text-primary group-hover:bg-background"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-brand">
                  {service.label}{" "}
                  <span className="text-foreground/80">
                    en {service.city}
                  </span>
                </span>
              </span>
            </button>
          );
        })}

        <div className="mt-auto space-y-3">
          <AdSidebarBlock />
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-xs font-semibold text-muted-foreground">Aviso</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Plataforma exclusiva para mayores de 18 años. Verifica la
              autenticidad de los perfiles antes de cualquier contacto.
            </p>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function MobileServiceTabs({
  active,
  onSelect,
}: {
  active: ServiceKey;
  onSelect: (key: ServiceKey) => void;
}) {
  return (
    <div className="-mx-4 mb-4 overflow-x-auto border-b bg-background px-4 md:hidden">
      <div className="flex gap-2 pb-3">
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = active === service.key;
          return (
            <button
              key={service.key}
              type="button"
              onClick={() => onSelect(service.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {service.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
