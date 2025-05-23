// Equipment Related Types
export interface EquipmentItem {
  id: string
  userId: string
  name: string
  type: EquipmentType
  brand?: string
  model?: string
  color?: string
  size?: string
  weight?: number
  attributes: Record<string, any>
  imageUrl?: string
  purchaseInfo?: PurchaseInfo
  tags: string[]
  isFavorite: boolean
  condition: EquipmentCondition
  notes?: string
  createdAt: string
  updatedAt: string
}

export type EquipmentType = 
  | 'lure'
  | 'rod'
  | 'reel'
  | 'line'
  | 'bait'
  | 'tackle'
  | 'other'

export type EquipmentCondition = 'new' | 'good' | 'fair' | 'poor'

export interface PurchaseInfo {
  price?: number
  shop?: string
  receiptUrl?: string
  purchaseDate?: string
}
