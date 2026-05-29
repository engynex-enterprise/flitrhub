"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Crown,
  Eye,
  Flame,
  MapPin,
  Megaphone,
  MousePointerClick,
  Phone,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import {
  AD_PRODUCT_CATALOG,
  type AdProductId,
  type AdProductMeta,
} from "@/features/home/components/ads";

import { AdTargetingDrawer } from "./ad-targeting-drawer";

/* -------------------- Mock data -------------------- */

const WALLET = {
  balance: 145_000,
  spentThisMonth: 320_000,
  activeCampaigns: 3,
};

type CampaignType = "top" | "destacado" | "story" | "tier" | "city" | "search";

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  postName: string;
  startDate: string;
  endDate: string;
  daysLeft: number;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  contacts: number;
}

const ACTIVE_CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    name: "Top de búsqueda · Bogotá",
    type: "search",
    postName: "Sofía",
    startDate: "12 may",
    endDate: "31 may",
    daysLeft: 8,
    budget: 180_000,
    spent: 117_000,
    impressions: 24_500,
    clicks: 1_640,
    contacts: 84,
  },
  {
    id: "c2",
    name: "Destacado en home",
    type: "destacado",
    postName: "Valentina",
    startDate: "20 may",
    endDate: "27 may",
    daysLeft: 4,
    budget: 70_000,
    spent: 38_000,
    impressions: 12_200,
    clicks: 920,
    contacts: 41,
  },
  {
    id: "c3",
    name: "Story sponsorizada",
    type: "story",
    postName: "Camila",
    startDate: "25 may",
    endDate: "28 may",
    daysLeft: 1,
    budget: 30_000,
    spent: 22_000,
    impressions: 8_400,
    clicks: 510,
    contacts: 18,
  },
];

const PRODUCTS: AdProductMeta[] = AD_PRODUCT_CATALOG;

const CAMPAIGN_TYPE_META: Record<
  CampaignType,
  { icon: typeof Megaphone; label: string }
> = {
  top: { icon: TrendingUp, label: "Top" },
  destacado: { icon: Flame, label: "Destacado" },
  story: { icon: Sparkles, label: "Story" },
  tier: { icon: Crown, label: "Upgrade" },
  city: { icon: MapPin, label: "Ciudad" },
  search: { icon: Search, label: "Búsqueda" },
};

function formatCOP(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}

/* -------------------- Component -------------------- */

export function ProviderAds() {
  const [targetingOpen, setTargetingOpen] = useState(false);
  const [initialProduct, setInitialProduct] = useState<AdProductId | undefined>(
    undefined
  );

  const openTargeting = (product?: AdProductId) => {
    setInitialProduct(product);
    setTargetingOpen(true);
  };

  return (
    <div className="space-y-4">
      <WalletCard />

      {/* Active campaigns */}
      <section>
        <SectionHeader
          icon={Zap}
          title="Campañas activas"
          subtitle={`${ACTIVE_CAMPAIGNS.length} promociones en curso`}
          action={
            <Button
              variant="brand"
              size="sm"
              onClick={() => openTargeting()}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Nueva campaña
            </Button>
          }
        />
        <div className="space-y-2.5">
          {ACTIVE_CAMPAIGNS.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </section>

      {/* Marketplace */}
      <section>
        <SectionHeader
          icon={Megaphone}
          title="Mejora tu alcance"
          subtitle="Compra promociones para destacar tu perfil y publicaciones"
        />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <AdProductCard
              key={p.id}
              product={p}
              onBuy={() => openTargeting(p.id)}
            />
          ))}
        </div>
      </section>

      <AdTargetingDrawer
        open={targetingOpen}
        onOpenChange={setTargetingOpen}
        initialProduct={initialProduct}
      />
    </div>
  );
}

/* -------------------- Wallet -------------------- */

function WalletCard() {
  return (
    <Card className="bg-gradient-sensual relative overflow-hidden p-5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Wallet className="h-7 w-7 text-gold" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/70">
              Saldo disponible
            </p>
            <p className="text-3xl font-bold leading-tight text-white">
              {formatCOP(WALLET.balance)}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-white/70">
              <span>
                Gastado este mes:{" "}
                <span className="font-semibold text-white">
                  {formatCOP(WALLET.spentThisMonth)}
                </span>
              </span>
              <span>
                Campañas activas:{" "}
                <span className="font-semibold text-white">
                  {WALLET.activeCampaigns}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="brand" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Recargar saldo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            Historial
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* -------------------- Section header -------------------- */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: typeof Eye;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h3 className="flex items-center gap-2 text-base font-bold tracking-tight">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* -------------------- Campaign card -------------------- */

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const meta = CAMPAIGN_TYPE_META[campaign.type];
  const Icon = meta.icon;
  const progress = (campaign.spent / campaign.budget) * 100;
  const ctr = ((campaign.clicks / campaign.impressions) * 100).toFixed(1);
  const convRate = ((campaign.contacts / campaign.clicks) * 100).toFixed(1);
  const cpc = Math.round(campaign.spent / campaign.clicks);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-bold">{campaign.name}</p>
              <Badge className="bg-emerald-500/15 px-1.5 py-0 text-[9px] font-semibold text-emerald-400">
                Activa
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Sobre{" "}
              <span className="font-semibold text-foreground">
                {campaign.postName}
              </span>
              {" · "}
              <Calendar className="inline h-2.5 w-2.5" /> {campaign.startDate} →{" "}
              {campaign.endDate}
              {" · "}
              {campaign.daysLeft}d restantes
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">
            Pausar
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">
            Editar
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">
            Presupuesto:{" "}
            <span className="font-semibold text-foreground">
              {formatCOP(campaign.spent)}
            </span>{" "}
            / {formatCOP(campaign.budget)}
          </span>
          <span className="font-semibold text-primary">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-platino"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        <CampaignMini
          icon={Eye}
          label="Impres."
          value={campaign.impressions.toLocaleString("es-CO")}
        />
        <CampaignMini
          icon={MousePointerClick}
          label="Clics"
          value={campaign.clicks.toLocaleString("es-CO")}
          sub={`${ctr}% CTR`}
        />
        <CampaignMini
          icon={Phone}
          label="Contactos"
          value={String(campaign.contacts)}
          sub={`${convRate}% conv`}
        />
        <CampaignMini icon={Target} label="CPC" value={formatCOP(cpc)} />
      </div>
    </Card>
  );
}

function CampaignMini({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-md border bg-background/50 p-2">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span className="text-[9px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-0.5 text-sm font-bold tabular-nums">{value}</p>
      {sub && <p className="text-[9px] text-emerald-400">{sub}</p>}
    </div>
  );
}

/* -------------------- Product card -------------------- */

function AdProductCard({
  product,
  onBuy,
}: {
  product: AdProductMeta;
  onBuy: () => void;
}) {
  const Icon = product.icon;
  return (
    <Card
      className={cn(
        "relative flex flex-col gap-3 p-4 transition-colors hover:border-primary/40",
        product.highlight && "border-primary/40 bg-primary/5"
      )}
    >
      {product.badge && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-950">
          {product.badge}
        </span>
      )}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            product.highlight
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 pr-12">
          <p className="text-sm font-bold leading-tight">{product.name}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {product.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-[11px]">
        <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
        <span className="font-medium text-muted-foreground">
          {product.estReach}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {product.durationDays === 1
              ? "Por día"
              : `${product.durationDays} días`}
          </p>
          <p className="text-xl font-bold leading-tight">
            {formatCOP(product.price)}
          </p>
        </div>
        <Button
          variant={product.highlight ? "brand" : "outline"}
          size="sm"
          onClick={onBuy}
          className="gap-1.5"
        >
          Comprar
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
