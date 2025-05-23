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
      set({ items: data || [], loading: false })
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

      const { data: newItem, error } = await supabase
        .from('equipment_items')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single()
      
      if (error) throw error
      
      set((state) => ({
        items: [newItem, ...state.items],
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
      const { data: updatedItem, error } = await supabase
        .from('equipment_items')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      set((state) => ({
        items: state.items.map(item => 
          item.id === id ? updatedItem : item
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
      is_favorite: !item.isFavorite
    })
  },
}))
