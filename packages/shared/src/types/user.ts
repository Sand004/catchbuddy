// User Related Types
export interface UserProfile {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  subscriptionTier: SubscriptionTier
  language: Language
  usageLimits: UsageLimits
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export type SubscriptionTier = 'free' | 'pro' | 'premium'
export type Language = 'de' | 'en' | 'es'

export interface UsageLimits {
  dailyRecommendations: number
  totalEquipment: number
  aiQueriesUsed: number
  lastReset?: string
}
