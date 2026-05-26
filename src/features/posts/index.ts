// Components
export { PostCard, TIER_STYLES } from "./components/post-card";
export { PostCardSkeleton } from "./components/post-card-skeleton";
export { PostListItem } from "./components/post-list-item";
export { PostFeed } from "./components/post-feed";
export { CreatePostDrawer } from "./components/create-post-drawer";
export { ProfileDetail } from "./components/profile-detail";
export { Destacados } from "./components/destacados";
export { Recomendados } from "./components/recomendados";
export { DiscreetCover } from "./components/discreet-cover";
export { FiltersPanel, FiltersOpenButton } from "./components/filters-panel";
export { PreferencesDialog } from "./components/preferences-dialog";

// Data
export {
  generatePosts,
  generateFeatured,
  generateStories,
  getPostById,
  generateGallery,
} from "./data/mock-posts";
export type {
  Post,
  Tier,
  BodyType,
  HairColor,
  Ethnicity,
  BreastsType,
  Language,
  ServiceLocation,
  PaymentMethod,
  TimeSlot,
} from "./data/mock-posts";
export { services } from "./data/services";
export type { Service, ServiceKey } from "./data/services";
export { SERVICE_FORM_CONFIG } from "./data/service-form-config";
export type { ServiceFormConfig, ChipGroup } from "./data/service-form-config";

// Filters
export * from "./lib/filters";

// Preferences (hook + helpers)
export {
  useUserPreferences,
  hasAnyPreference,
  computeMatchScore,
  DEFAULT_PREFERENCES,
} from "./preferences";
export type { UserPreferences, MatchResult } from "./preferences";
