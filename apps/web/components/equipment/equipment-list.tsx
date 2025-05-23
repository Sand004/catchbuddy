'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { EquipmentCard } from '@catchsmart/ui/src/components/card'
import type { EquipmentItem } from '@catchsmart/shared'
import { useEquipmentStore } from '@/lib/stores/equipment-store'

interface EquipmentListProps {
  onEdit?: (item: EquipmentItem) => void
  filterType?: string
  searchQuery?: string
}

export function EquipmentList({ 
  onEdit,
  filterType = 'all',
  searchQuery = ''
}: EquipmentListProps) {
  const t = useTranslations()
  const { items, toggleFavorite, deleteEquipment } = useEquipmentStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter items based on type and search query
  const filteredItems = items.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesType && matchesSearch
  })

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchtest du diese Ausrüstung wirklich löschen?')) {
      setDeletingId(id)
      try {
        await deleteEquipment(id)
      } catch (error) {
        console.error('Failed to delete equipment:', error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchQuery || filterType !== 'all' 
            ? 'Keine Ausrüstung gefunden'
            : t('equipment.empty.description')
          }
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredItems.map((item) => (
        <div key={item.id} className="relative group">
          <EquipmentCard
            image={item.imageUrl}
            title={item.name}
            subtitle={`${item.brand || ''} ${item.model || ''}`.trim() || t(`equipment.types.${item.type}`)}
            favorite={item.isFavorite}
            onFavoriteToggle={() => toggleFavorite(item.id)}
            onClick={() => onEdit?.(item)}
            className="cursor-pointer"
          >
            <div className="mt-3 space-y-2">
              {/* Additional info */}
              <div className="flex flex-wrap gap-2 text-xs">
                {item.color && (
                  <span className="text-muted-foreground">
                    Farbe: {item.color}
                  </span>
                )}
                {item.size && (
                  <span className="text-muted-foreground">
                    Größe: {item.size}
                  </span>
                )}
                {item.weight && (
                  <span className="text-muted-foreground">
                    {item.weight}g
                  </span>
                )}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-accent px-2 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Condition indicator */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${
                  item.condition === 'new' ? 'text-cs-secondary' :
                  item.condition === 'good' ? 'text-cs-primary' :
                  item.condition === 'fair' ? 'text-yellow-500' :
                  'text-cs-error'
                }`}>
                  {item.condition === 'new' ? 'Neu' :
                   item.condition === 'good' ? 'Gut' :
                   item.condition === 'fair' ? 'Befriedigend' :
                   'Schlecht'
                  }
                </span>
              </div>
            </div>
          </EquipmentCard>

          {/* Delete button - shows on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(item.id)
            }}
            disabled={deletingId === item.id}
            className="absolute top-2 right-12 p-2 rounded-full bg-cs-error/10 text-cs-error opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cs-error/20"
            aria-label="Löschen"
          >
            {deletingId === item.id ? (
              <div className="w-4 h-4 border-2 border-cs-error border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
