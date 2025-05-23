// Shared Constants
export const EQUIPMENT_TYPES = [
  'lure',
  'rod',
  'reel',
  'line',
  'bait',
  'tackle',
  'other'
] as const

export const WATER_TYPES = [
  'freshwater',
  'saltwater',
  'brackish'
] as const

export const SUBSCRIPTION_TIERS = [
  'free',
  'pro',
  'premium'
] as const

export const SUPPORTED_LANGUAGES = [
  'de',
  'en',
  'es'
] as const

export const USAGE_LIMITS = {
  free: {
    dailyRecommendations: 2,
    totalEquipment: 10,
    aiQueriesPerDay: 5
  },
  pro: {
    dailyRecommendations: 20,
    totalEquipment: 100,
    aiQueriesPerDay: 50
  },
  premium: {
    dailyRecommendations: -1, // unlimited
    totalEquipment: -1,
    aiQueriesPerDay: -1
  }
} as const
