// Fishing Related Types
export interface FishingTrip {
  id: string
  userId: string
  title: string
  location: GeoPoint
  locationName: string
  waterType?: WaterType
  startedAt: string
  endedAt?: string
  weatherData: WeatherData
  waterConditions: WaterConditions
  targetSpecies: string[]
  notes?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface Catch {
  id: string
  tripId: string
  userId: string
  species: string
  weight?: number
  length?: number
  equipmentUsed: string[] // Equipment IDs
  baitUsed?: string
  technique?: string
  location?: GeoPoint
  depth?: number
  photoUrls: string[]
  notes?: string
  weatherConditions: WeatherData
  successFactors: Record<string, any>
  isReleased: boolean
  rating?: number
  caughtAt: string
  createdAt: string
  updatedAt: string
}

export type WaterType = 'freshwater' | 'saltwater' | 'brackish'

export interface GeoPoint {
  latitude: number
  longitude: number
}

export interface WeatherData {
  temperature?: number
  windSpeed?: number
  windDirection?: number
  pressure?: number
  humidity?: number
  conditions?: string
  cloudCover?: number
}

export interface WaterConditions {
  temperature?: number
  clarity?: string
  flow?: string
  depth?: number
  pH?: number
}
