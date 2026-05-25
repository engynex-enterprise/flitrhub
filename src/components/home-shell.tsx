"use client";

import { useCallback, useMemo, useState } from "react";
import { MapPin } from "lucide-react";

import { Header } from "@/components/header";
import { Sidebar, MobileServiceTabs } from "@/components/sidebar";
import { FiltersPanel, FiltersOpenButton } from "@/components/filters-panel";
import { ViewSwitcher } from "@/components/view-switcher";
import { Stories } from "@/components/stories";
import { Destacados } from "@/components/destacados";
import { Recomendados } from "@/components/recomendados";
import { QuickActions } from "@/components/quick-actions";
import { AdBanner } from "@/components/ads";
import { PostFeed } from "@/components/post-feed";
import { CreatePostDrawer } from "@/components/create-post-drawer";
import { PreferencesDialog } from "@/components/preferences-dialog";
import { services, type ServiceKey } from "@/lib/services";
import {
  DEFAULT_FILTERS,
  countActiveFilters,
  type Filters,
  type ViewMode,
} from "@/lib/filters";
import {
  generateFeatured,
  generatePosts,
  generateStories,
} from "@/lib/mock-posts";
import { useUserPreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

const NEARBY_RADIUS_KM = 10;

export function HomeShell() {
  const [active, setActive] = useState<ServiceKey>("masajes");
  const [city, setCity] = useState("Bogotá");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [resultCount, setResultCount] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [nearbyActive, setNearbyActive] = useState(false);

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

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleNearby = useCallback(() => {
    setNearbyActive((wasActive) => {
      if (wasActive) {
        setFilters((f) => ({ ...f, distanceKm: null, sort: "relevance" }));
        return false;
      }
      setFilters((f) => ({
        ...f,
        distanceKm: NEARBY_RADIUS_KM,
        sort: "distance",
      }));
      return true;
    });
  }, []);

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className="min-h-screen bg-background">
      <Header
        city={city}
        onCityChange={setCity}
        favoritesCount={favorites.size}
        onCreatePost={() => setCreateOpen(true)}
      />

      <Sidebar active={active} onSelect={setActive} />

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
                {current.label}
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

        <AdBanner className="mb-8" />

        {hydrated && (
          <Recomendados
            posts={recommendationCandidates}
            prefs={prefs}
            onEditPreferences={() => setPrefsOpen(true)}
          />
        )}

        <Destacados posts={featured} />

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Todos los perfiles</h2>
          <ViewSwitcher value={viewMode} onChange={setViewMode} />
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
    </div>
  );
}
