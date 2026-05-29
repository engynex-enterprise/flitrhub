"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";

import { Header } from "@/features/layout/components/header";
import { Sidebar, MobileServiceTabs } from "@/features/home/components/sidebar";
import { FiltersPanel, FiltersOpenButton } from "@/features/posts/components/filters-panel";
import { ViewSwitcher } from "@/features/home/components/view-switcher";
import { Stories } from "@/features/stories/components/stories";
import { Destacados } from "@/features/posts/components/destacados";
import { Recomendados } from "@/features/posts/components/recomendados";
import { QuickActions } from "@/features/home/components/quick-actions";
import { AdBanner } from "@/features/home/components/ads";
import {
  HomeMainBanner,
  MatchedPreferenceBanner,
  PushNotificationToast,
  TopOfServicePin,
} from "@/features/home/components/sponsored-content";
import { WelcomeAdModal } from "@/features/home/components/welcome-ad-modal";
import { PostFeed } from "@/features/posts/components/post-feed";
import { CreatePostDrawer } from "@/features/posts/components/create-post-drawer";
import { PreferencesDialog } from "@/features/posts/components/preferences-dialog";
import { services, type ServiceKey } from "@/features/posts/data/services";
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  type Filters,
  type ViewMode,
} from "@/features/posts/lib/filters";
import {
  generateFeatured,
  generatePosts,
  generateStories,
} from "@/features/posts/data/mock-posts";
import { useUserPreferences } from "@/features/posts/preferences";
import { useFavorites } from "@/features/favorites/use-favorites";
import { useSession } from "@/features/auth/session";
import { discreetLabel, useDiscreet } from "@/features/discreet/use-discreet";
import { cn } from "@/shared/lib/utils";

const NEARBY_RADIUS_KM = 10;

const DEFAULT_SERVICE: ServiceKey = "masajes";
const DEFAULT_CITY = "Bogotá";

function isServiceKey(value: string | null): value is ServiceKey {
  return value !== null && services.some((s) => s.key === value);
}

export function HomeShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-derived state. Defaults are kept out of the URL to keep it clean.
  const serviceParam = searchParams.get("service");
  const active: ServiceKey = isServiceKey(serviceParam)
    ? serviceParam
    : DEFAULT_SERVICE;
  const city = searchParams.get("city") ?? DEFAULT_CITY;
  const viewMode: ViewMode =
    searchParams.get("view") === "list" ? "list" : "card";
  const nearbyActive = searchParams.get("nearby") === "1";
  // Filters panel: default open; closes only when ?filters=closed.
  const filtersOpen = searchParams.get("filters") !== "closed";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) params.delete(key);
        else params.set(key, value);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  const setActive = useCallback(
    (key: ServiceKey) =>
      updateParams({ service: key === DEFAULT_SERVICE ? null : key }),
    [updateParams]
  );
  const setCity = useCallback(
    (next: string) =>
      updateParams({ city: next === DEFAULT_CITY ? null : next }),
    [updateParams]
  );
  const setViewMode = useCallback(
    (next: ViewMode) => updateParams({ view: next === "card" ? null : next }),
    [updateParams]
  );
  const setFiltersOpen = useCallback(
    (open: boolean) => updateParams({ filters: open ? null : "closed" }),
    [updateParams]
  );

  // Filters object stays in local state (too many fields for the URL).
  // It's seeded from the nearby URL flag so refresh respects it.
  const [filters, setFilters] = useState<Filters>(() =>
    searchParams.get("nearby") === "1"
      ? { ...DEFAULT_FILTERS, distanceKm: NEARBY_RADIUS_KM, sort: "distance" }
      : DEFAULT_FILTERS
  );

  const { favorites, toggleFavorite } = useFavorites();
  const { enabled: discreet } = useDiscreet();
  const { isProvider } = useSession();
  const [resultCount, setResultCount] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const {
    prefs,
    save: savePrefs,
    clear: clearPrefs,
    hydrated,
    hasPreferences,
  } = useUserPreferences();

  const current = useMemo(
    () => services.find((s) => s.key === active) ?? services[0],
    [active]
  );

  const featured = useMemo(
    () => generateFeatured(active, city),
    [active, city]
  );

  const stories = useMemo(
    () => generateStories(active, city),
    [active, city]
  );

  // Candidate pool for recommendations — larger than what the feed has loaded so far.
  const recommendationCandidates = useMemo(
    () => generatePosts(0, 36, active, city),
    [active, city]
  );

  const toggleNearby = useCallback(() => {
    if (nearbyActive) {
      setFilters((f) => ({ ...f, distanceKm: null, sort: "relevance" }));
      updateParams({ nearby: null });
    } else {
      setFilters((f) => ({
        ...f,
        distanceKm: NEARBY_RADIUS_KM,
        sort: "distance",
      }));
      updateParams({ nearby: "1" });
    }
  }, [nearbyActive, updateParams]);

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="min-h-screen bg-background">
      <Header
        city={city}
        onCityChange={setCity}
        favoritesCount={favorites.size}
        onCreatePost={() => setCreateOpen(true)}
      />

      <Sidebar
        active={active}
        onSelect={setActive}
        showAds={isProvider}
        showSponsoredPick={!isProvider}
      />

      <main
        className={cn(
          "px-4 py-6 transition-[margin] duration-300 md:px-8",
          "md:ml-72",
          filtersOpen ? "md:mr-80" : "md:mr-0"
        )}
      >
        <MobileServiceTabs active={active} onSelect={setActive} />

        <Stories items={stories} />

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              <span className="bg-gradient-to-r from-primary to-brand bg-clip-text text-transparent">
                {discreet ? discreetLabel(current.key) : current.label}
              </span>{" "}
              <span className="text-foreground">en {city}</span>
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {resultCount > 0
                ? `${resultCount} perfiles disponibles`
                : "Perfiles verificados cerca de ti"}
            </p>
          </div>
        </div>

        <QuickActions
          nearbyActive={nearbyActive}
          nearbyRadius={NEARBY_RADIUS_KM}
          onToggleNearby={toggleNearby}
          hasPreferences={hasPreferences}
          onOpenPreferences={() => setPrefsOpen(true)}
        />

        {isProvider ? (
          <AdBanner className="mb-8" />
        ) : (
          <HomeMainBanner service={active} city={city} className="mb-8" />
        )}

        {hydrated && (
          <Recomendados
            posts={recommendationCandidates}
            prefs={prefs}
            onEditPreferences={() => setPrefsOpen(true)}
          />
        )}

        {/* Match con preferencias — sponsored profile that matches saved filters */}
        {hydrated && (
          <div className="mb-8">
            <MatchedPreferenceBanner service={active} city={city} />
          </div>
        )}

        <Destacados posts={featured} />

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Todos los perfiles</h2>
          <ViewSwitcher value={viewMode} onChange={setViewMode} />
        </div>

        {/* Top del servicio — pinned sponsored profile above the feed */}
        <div className="mb-4">
          <TopOfServicePin service={active} city={city} />
        </div>

        <PostFeed
          service={active}
          city={city}
          filters={filters}
          viewMode={viewMode}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onCountChange={setResultCount}
        />
      </main>

      <FiltersPanel
        filters={filters}
        onChange={setFilters}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      {!filtersOpen && (
        <FiltersOpenButton
          onClick={() => setFiltersOpen(true)}
          activeCount={activeFilterCount}
        />
      )}

      <CreatePostDrawer open={createOpen} onOpenChange={setCreateOpen} />

      <PreferencesDialog
        open={prefsOpen}
        onOpenChange={setPrefsOpen}
        prefs={prefs}
        onSave={savePrefs}
        onClear={clearPrefs}
      />

      <WelcomeAdModal />
      <PushNotificationToast />
    </div>
  );
}
