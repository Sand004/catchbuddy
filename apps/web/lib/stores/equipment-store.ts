import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@catchsmart/database/types/database'

type Equipment = Database['public']['Tables']['equipment_items']['Row']
type EquipmentInsert = Database['public']['Tables']['equipment_items']['Insert']

interface EquipmentState {
  items: Equipment[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchEquipment: () => Promise<void>
  addEquipment: (equipment: EquipmentInsert) => Promise<Equipment | null>
  updateEquipment: (id: string, updates: Partial<EquipmentInsert>) => Promise<void>
  deleteEquipment: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  setError: (error: string | null) => void
}

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchEquipment: async () => {
    const supabase = createClient()
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('equipment_items')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      set({ items: data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  addEquipment: async (equipment) => {
    const supabase = createClient()
    set({ error: null })
    
    try {
      const { data, error } = await supabase
        .from('equipment_items')
        .insert(equipment)
        .select()
        .single()
      
      if (error) throw error
      
      set(state => ({
        items: [data, ...state.items]
      }))
      
      return data
    } catch (error: any) {
      set({ error: error.message })
      return null
    }
  },

  updateEquipment: async (id, updates) => {
    const supabase = createClient()
    set({ error: null })
    
    try {
      const { error } = await supabase
        .from('equipment_items')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      
      set(state => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  deleteEquipment: async (id) => {
    const supabase = createClient()
    set({ error: null })
    
    try {
      const { error } = await supabase
        .from('equipment_items')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      set(state => ({
        items: state.items.filter(item => item.id !== id)
      }))
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  toggleFavorite: async (id) => {
    const item = get().items.find(i => i.id === id)
    if (!item) return
    
    await get().updateEquipment(id, { is_favorite: !item.is_favorite })
  },

  setError: (error) => set({ error })
}))
