// AI Related Types
export interface Recommendation {
  id: string
  userId: string
  context: RecommendationContext
  recommendedItems: string[] // Equipment IDs
  reasoning: string
  confidenceScore: number
  llmResponse: Record<string, any>
  userFeedback?: number
  wasUsed: boolean
  successOutcome?: boolean
  createdAt: string
}

export interface RecommendationContext {
  weather: WeatherData
  location: GeoPoint
  locationName: string
  targetSpecies?: string[]
  timeOfDay: string
  season: string
  waterType?: WaterType
  userEquipment: string[] // Available equipment IDs
  recentCatches?: string[] // Recent catch IDs for context
}

export interface AIQuery {
  query: string
  context: RecommendationContext
  userId: string
}

export interface AIResponse {
  recommendations: Recommendation[]
  reasoning: string
  confidence: number
  alternatives?: string[]
  tips?: string[]
}

// Import types from fishing.ts
import { WeatherData, GeoPoint, WaterType } from './fishing'
