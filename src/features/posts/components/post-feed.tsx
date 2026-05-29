"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, SearchX } from "lucide-react";

import { PostCard } from "@/features/posts/components/post-card";
import { PostListItem } from "@/features/posts/components/post-list-item";
import { PostCardSkeleton } from "@/features/posts/components/post-card-skeleton";
import { AdInlineCard, AdRowBanner } from "@/features/home/components/ads";
import { useSession } from "@/features/auth/session";
import { cn } from "@/shared/lib/utils";
import { generatePosts, type Post } from "@/features/posts/data/mock-posts";
import type { ServiceKey } from "@/features/posts/data/services";
import { matchesHeight, type Filters, type ViewMode } from "@/features/posts/lib/filters";

const PAGE_SIZE = 12;
const MAX_PAGES = 8;
const AD_INLINE_EVERY = 5;
const AD_ROW_EVERY = 12;

interface PostFeedProps {
  service: ServiceKey;
  city: string;
  filters: Filters;
  viewMode: ViewMode;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onCountChange?: (count: number) => void;
}

function matchesAge(age: number, range: Filters["ageRange"]) {
  if (range === "all") return true;
  if (range === "18-25") return age >= 18 && age <= 25;
  if (range === "26-35") return age >= 26 && age <= 35;
  if (range === "36+") return age >= 36;
  return true;
}

function applyFilters(
  posts: Post[],
  filters: Filters,
  favorites: Set<string>
): Post[] {
  const q = filters.search.trim().toLowerCase();
  const filtered = posts.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false;

    // Categoría
    if (filters.tier !== "all" && p.tier !== filters.tier) return false;
    if (filters.featuredOnly && !p.isFeatured) return false;

    // Ubicación
    if (filters.zones.length > 0 && !filters.zones.includes(p.location)) return false;
    if (filters.distanceKm !== null && p.distanceKm > filters.distanceKm) return false;
    if (
      filters.serviceLocations.length > 0 &&
      !filters.serviceLocations.some((sl) => p.serviceLocations.includes(sl))
    )
      return false;

    // Físico
    if (!matchesAge(p.age, filters.ageRange)) return false;
    if (!matchesHeight(p.height, filters.heightRange)) return false;
    if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(p.bodyType))
      return false;
    if (filters.hairColors.length > 0 && !filters.hairColors.includes(p.hairColor))
      return false;
    if (filters.ethnicities.length > 0 && !filters.ethnicities.includes(p.ethnicity))
      return false;
    if (filters.breasts !== "any" && p.breasts !== filters.breasts) return false;
    if (filters.tattoos === "yes" && !p.hasTattoos) return false;
    if (filters.tattoos === "no" && p.hasTattoos) return false;
    if (filters.piercings === "yes" && !p.hasPiercings) return false;
    if (filters.piercings === "no" && p.hasPiercings) return false;

    // Idiomas
    if (
      filters.languages.length > 0 &&
      !filters.languages.some((l) => p.languages.includes(l))
    )
      return false;

    // Disponibilidad
    if (
      filters.availabilitySlots.length > 0 &&
      !filters.availabilitySlots.some((s) => p.availableSlots.includes(s))
    )
      return false;

    // Precio y pago
    if (filters.maxPrice !== null && p.pricePerHour > filters.maxPrice) return false;
    if (
      filters.paymentMethods.length > 0 &&
      !filters.paymentMethods.some((m) => p.paymentMethods.includes(m))
    )
      return false;

    // Calidad
    if (filters.withVideo && !p.hasVideo) return false;
    if (filters.verifiedOnly && !p.verified) return false;
    if (filters.onlineOnly && !p.isOnline) return false;
    if (filters.favoritesOnly && !favorites.has(p.id)) return false;
    if (filters.minRating !== null && (p.rating ?? 0) < filters.minRating)
      return false;

    return true;
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case "rating":
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case "age-asc":
      sorted.sort((a, b) => a.age - b.age);
      break;
    case "age-desc":
      sorted.sort((a, b) => b.age - a.age);
      break;
    case "price-asc":
      sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
      break;
    case "distance":
      sorted.sort((a, b) => a.distanceKm - b.distanceKm);
      break;
  }
  return sorted;
}

const GRID_CLASSES: Record<ViewMode, string> = {
  card: "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3",
  list: "flex flex-col gap-3",
};

export function PostFeed({
  service,
  city,
  filters,
  viewMode,
  favorites,
  onToggleFavorite,
  onCountChange,
}: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const requestId = useRef(0);
  const { isProvider } = useSession();

  const loadPage = useCallback(
    async (nextPage: number, replace = false) => {
      const id = ++requestId.current;
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      if (id !== requestId.current) return;
      const next = generatePosts(nextPage, PAGE_SIZE, service, city);
      setPosts((prev) => (replace ? next : [...prev, ...next]));
      setPage(nextPage + 1);
      setHasMore(nextPage + 1 < MAX_PAGES);
      setLoading(false);
    },
    [service, city]
  );

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    loadPage(0, true);
  }, [service, city, loadPage]);

  const { ref } = useInView({
    rootMargin: "400px 0px",
    onChange: (inView) => {
      if (inView && !loading && hasMore) {
        loadPage(page);
      }
    },
  });

  const visiblePosts = useMemo(
    () => applyFilters(posts, filters, favorites),
    [posts, filters, favorites]
  );

  useEffect(() => {
    onCountChange?.(visiblePosts.length);
  }, [visiblePosts.length, onCountChange]);

  const isEmpty = !loading && visiblePosts.length === 0 && posts.length > 0;

  const renderPost = (post: Post) => {
    if (viewMode === "list") {
      return (
        <PostListItem
          post={post}
          isFavorite={favorites.has(post.id)}
          onToggleFavorite={onToggleFavorite}
        />
      );
    }
    return (
      <PostCard
        post={post}
        isFavorite={favorites.has(post.id)}
        onToggleFavorite={onToggleFavorite}
      />
    );
  };

  return (
    <div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-base font-semibold">Sin resultados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prueba ajustando los filtros para ver más perfiles.
          </p>
        </div>
      ) : (
        <div className={cn(GRID_CLASSES[viewMode])}>
          {visiblePosts.map((post, idx) => {
            const position = idx + 1;
            const showInlineAd =
              isProvider &&
              position % AD_INLINE_EVERY === 0 &&
              position % AD_ROW_EVERY !== 0;
            const showRowAd = isProvider && position % AD_ROW_EVERY === 0;
            return (
              <Fragment key={post.id}>
                {renderPost(post)}
                {showInlineAd && <AdInlineCard key={`ad-i-${idx}`} />}
                {showRowAd && (
                  <div
                    key={`ad-r-${idx}`}
                    className={viewMode === "card" ? "sm:col-span-2 xl:col-span-3" : ""}
                  >
                    <AdRowBanner />
                  </div>
                )}
              </Fragment>
            );
          })}
          {loading &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <PostCardSkeleton key={`sk-${i}`} />
            ))}
        </div>
      )}

      {hasMore && (
        <div
          ref={ref}
          className="mt-10 flex items-center justify-center py-6 text-sm text-muted-foreground"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando más perfiles...
            </span>
          ) : (
            <span>Desplázate para ver más</span>
          )}
        </div>
      )}

      {!hasMore && visiblePosts.length > 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Has visto todos los perfiles disponibles.
        </p>
      )}
    </div>
  );
}
