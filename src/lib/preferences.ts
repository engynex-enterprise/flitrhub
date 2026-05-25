"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  BodyType,
  Ethnicity,
  HairColor,
  Language,
  Post,
  ServiceLocation,
  Tier,
} from "./mock-posts";

export interface UserPreferences {
  ageRange: "all" | "18-25" | "26-35" | "36+";
  bodyTypes: BodyType[];
  hairColors: HairColor[];
  ethnicities: Ethnicity[];
  preferredTiers: (Tier | "any")[]; // "any" = any tier accepted
  languages: Language[];
  serviceLocations: ServiceLocation[];
  maxPrice: number | null;
  maxDistanceKm: number | null;
  verifiedOnly: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  ageRange: "all",
  bodyTypes: [],
  hairColors: [],
  ethnicities: [],
  preferredTiers: [],
  languages: [],
  serviceLocations: [],
  maxPrice: null,
  maxDistanceKm: null,
  verifiedOnly: false,
};

const STORAGE_KEY = "flitrhub:preferences";

export function useUserPreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const save = useCallback((next: UserPreferences) => {
    setPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const clear = useCallback(() => {
    setPrefs(DEFAULT_PREFERENCES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { prefs, save, clear, hydrated, hasPreferences: hasAnyPreference(prefs) };
}

export function hasAnyPreference(p: UserPreferences): boolean {
  return (
    p.ageRange !== "all" ||
    p.bodyTypes.length > 0 ||
    p.hairColors.length > 0 ||
    p.ethnicities.length > 0 ||
    p.preferredTiers.length > 0 ||
    p.languages.length > 0 ||
    p.serviceLocations.length > 0 ||
    p.maxPrice !== null ||
    p.maxDistanceKm !== null ||
    p.verifiedOnly
  );
}

function ageMatches(age: number, range: UserPreferences["ageRange"]) {
  if (range === "all") return true;
  if (range === "18-25") return age >= 18 && age <= 25;
  if (range === "26-35") return age >= 26 && age <= 35;
  return age >= 36;
}

export interface MatchResult {
  score: number; // 0–100
  matched: number;
  total: number;
}

/**
 * Computes how well a profile matches the user's preferences.
 * Each criterion the user has set contributes equally to the final score.
 * Returns 0 if the user has no preferences set.
 */
export function computeMatchScore(post: Post, prefs: UserPreferences): MatchResult {
  let matched = 0;
  let total = 0;

  if (prefs.ageRange !== "all") {
    total++;
    if (ageMatches(post.age, prefs.ageRange)) matched++;
  }
  if (prefs.bodyTypes.length > 0) {
    total++;
    if (prefs.bodyTypes.includes(post.bodyType)) matched++;
  }
  if (prefs.hairColors.length > 0) {
    total++;
    if (prefs.hairColors.includes(post.hairColor)) matched++;
  }
  if (prefs.ethnicities.length > 0) {
    total++;
    if (prefs.ethnicities.includes(post.ethnicity)) matched++;
  }
  if (prefs.preferredTiers.length > 0) {
    total++;
    if (prefs.preferredTiers.includes(post.tier)) matched++;
  }
  if (prefs.languages.length > 0) {
    total++;
    if (prefs.languages.some((l) => post.languages.includes(l))) matched++;
  }
  if (prefs.serviceLocations.length > 0) {
    total++;
    if (prefs.serviceLocations.some((sl) => post.serviceLocations.includes(sl)))
      matched++;
  }
  if (prefs.maxPrice !== null) {
    total++;
    if (post.pricePerHour <= prefs.maxPrice) matched++;
  }
  if (prefs.maxDistanceKm !== null) {
    total++;
    if (post.distanceKm <= prefs.maxDistanceKm) matched++;
  }
  if (prefs.verifiedOnly) {
    total++;
    if (post.verified) matched++;
  }

  const score = total === 0 ? 0 : Math.round((matched / total) * 100);
  return { score, matched, total };
}
