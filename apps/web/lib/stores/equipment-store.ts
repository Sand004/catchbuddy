import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { EquipmentItem } from '@catchsmart/shared'

interface EquipmentState {
  items: EquipmentItem[]
  loading: boolean
  error: string | null
  
  // Actions
  setItems: (items: EquipmentItem[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // CRUD operations
  fetchEquipment: () => Promise<void>
  addEquipment: (data: Partial<EquipmentItem>) => Promise<void>
  updateEquipment: (id: string, data: Partial<EquipmentItem>) => Promise<void>
  deleteEquipment: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
}

// Helper function to convert from camelCase to snake_case for database
const toSnakeCase = (data: any) => {
  const mapped: any = {}
  
  Object.keys(data).forEach(key => {
    // Map specific fields that need conversion
    if (key === 'isFavorite') {
      mapped['is_favorite'] = data[key]
    } else if (key === 'userId') {
      mapped['user_id'] = data[key]
    } else if (key === 'imageUrl') {
      mapped['image_url'] = data[key]
    } else if (key === 'purchaseInfo') {
      mapped['purchase_info'] = data[key]
    } else if (key === 'createdAt') {
      mapped['created_at'] = data[key]
    } else if (key === 'updatedAt') {
      mapped['updated_at'] = data[key]
    } else {
      // Keep other fields as-is
      mapped[key] = data[key]
    }
  })
  
  return mapped
}

// Helper function to convert from snake_case to camelCase from database
const toCamelCase = (data: any) => {
  if (!data) return null
  
  return {
    ...data,
    isFavorite: data.is_favorite,
    userId: data.user_id,
    imageUrl: data.image_url,
    purchaseInfo: data.purchase_info,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  // Basic setters
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch all equipment for the current user
  fetchEquipment: async () => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('equipment_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Convert snake_case to camelCase
      const items = (data || []).map(toCamelCase)
      set({ items, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  // Add new equipment
  addEquipment: async (data) => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Convert camelCase to snake_case for database
      const dbData = toSnakeCase({
        ...data,
        user_id: user.id,
      })

      const { data: newItem, error } = await supabase
        .from('equipment_items')
        .insert(dbData)
        .select()
        .single()
      
      if (error) throw error
      
      // Convert response back to camelCase
      const camelCaseItem = toCamelCase(newItem)
      
      set((state) => ({
        items: [camelCaseItem, ...state.items],
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Update equipment
  updateEquipment: async (id, data) => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      // Convert camelCase to snake_case for database
      const dbData = toSnakeCase(data)
      
      const { data: updatedItem, error } = await supabase
        .from('equipment_items')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      // Convert response back to camelCase
      const camelCaseItem = toCamelCase(updatedItem)
      
      set((state) => ({
        items: state.items.map(item => 
          item.id === id ? camelCaseItem : item
        ),
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Delete equipment
  deleteEquipment: async (id) => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { error } = await supabase
        .from('equipment_items')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      set((state) => ({
        items: state.items.filter(item => item.id !== id),
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Toggle favorite status
  toggleFavorite: async (id) => {
    const item = get().items.find(i => i.id === id)
    if (!item) return

    await get().updateEquipment(id, {
      isFavorite: !item.isFavorite
    })
  },
}))
