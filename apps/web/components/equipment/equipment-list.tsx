'use client'

import { EquipmentCard } from '@catchsmart/ui/src/components/card'
import { useEquipmentStore } from '@/lib/stores/equipment-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { Database } from '@catchsmart/database/types/database'

type Equipment = Database['public']['Tables']['equipment_items']['Row']

interface EquipmentListProps {
  onEdit?: (item: Equipment) => void
  filterType?: string
  searchQuery?: string
}

export function EquipmentList({ onEdit, filterType = 'all', searchQuery = '' }: EquipmentListProps) {
  const { items, toggleFavorite } = useEquipmentStore()
  const { user } = useAuthStore()

  const filteredItems = items.filter(item => {
    // Filter by type
    if (filterType !== 'all' && item.type !== filterType) {
      return false
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        item.name.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query) ||
        item.model?.toLowerCase().includes(query) ||
        item.color?.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchQuery || filterType !== 'all' 
            ? 'Keine Ausrüstung gefunden' 
            : 'Noch keine Ausrüstung vorhanden'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredItems.map((item) => (
        <EquipmentCard
          key={item.id}
          title={item.name}
          subtitle={[item.brand, item.size].filter(Boolean).join(' • ')}
          image={item.image_url || undefined}
          favorite={item.is_favorite || false}
          onFavoriteToggle={() => toggleFavorite(item.id)}
          onClick={() => onEdit?.(item)}
        >
          {item.condition && item.condition !== 'good' && (
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">
                Zustand: {
                  item.condition === 'new' ? 'Neu' :
                  item.condition === 'fair' ? 'Gebraucht' :
                  item.condition === 'poor' ? 'Schlecht' : item.condition
                }
              </span>
            </div>
          )}
        </EquipmentCard>
      ))}
    </div>
  )
}
