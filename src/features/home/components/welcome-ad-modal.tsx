"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, Sparkles, Star } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { SponsoredTag } from "@/features/home/components/ads";
import { useSession } from "@/features/auth/session";
import { generateFeatured } from "@/features/posts/data/mock-posts";
import { formatCOP } from "@/shared/lib/format";

const STORAGE_KEY = "flitrhub:welcome-ad-seen";

/* One-shot promo modal shown on first home visit to clients.
 * Pitches a featured profile with a discreet "Ad" tag. */
export function WelcomeAdModal() {
  const { isProvider, user } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Provider or unknown session: skip.
    if (isProvider) return;
    if (typeof window === "undefined") return;
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (seen) return;
    } catch {
      return;
    }
    // Defer to next tick so it doesn't fight initial paint.
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, [isProvider]);

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  };

  // Pick a deterministic featured profile.
  const featured = generateFeatured("masajes");
  const post = featured[0];
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.name}
            fill
            sizes="(max-width: 640px) 100vw, 28rem"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <SponsoredTag className="absolute right-3 top-3" />
        </div>

        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-gold" />
            {user ? `Hola, ${user.name.split(" ")[0]}` : "Te recomendamos"}
          </DialogTitle>
          <DialogDescription>
            Un perfil destacado que coincide con tu zona y servicios populares.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-6 pb-6 pt-2">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-base font-bold">{post.name}</p>
              {post.verified && (
                <BadgeCheck className="h-4 w-4 fill-sky-500 text-white" />
              )}
            </div>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {post.location}, {post.city}
              </span>
              {post.rating && (
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {post.rating.toFixed(1)}
                </span>
              )}
              <span>· desde {formatCOP(post.pricePerHour)}</span>
            </p>
          </div>
          <p className="line-clamp-2 text-xs text-foreground/80">
            {post.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="brand" size="sm" className="flex-1">
              <Link
                href={`/post/${encodeURIComponent(post.id)}`}
                onClick={() => handleClose(false)}
              >
                Conocer perfil
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClose(false)}
            >
              Quizás luego
            </Button>
          </div>
          <p className="text-center text-[9px] uppercase tracking-wider text-muted-foreground">
            Contenido patrocinado · no volverá a aparecer
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
