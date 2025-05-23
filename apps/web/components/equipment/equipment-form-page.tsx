'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Save, X } from 'lucide-react'
import { Button } from '@catchsmart/ui/src/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@catchsmart/ui/src/components/card'
import { useEquipmentStore } from '@/lib/stores/equipment-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { Database } from '@catchsmart/database/types/database'
import type { EquipmentItem } from '@catchsmart/shared'

type EquipmentInsert = Database['public']['Tables']['equipment_items']['Insert']

interface EquipmentFormPageProps {
  onSuccess: () => void
  onCancel: () => void
  initialData?: EquipmentItem
  editMode?: boolean
  equipmentId?: string
}

export function EquipmentForm({ 
  onSuccess, 
  onCancel, 
  initialData, 
  editMode = false,
  equipmentId 
}: EquipmentFormPageProps) {
  const t = useTranslations()
  const { user } = useAuthStore()
  const { addEquipment, updateEquipment } = useEquipmentStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<EquipmentInsert>>({
    name: initialData?.name || '',
    type: initialData?.type || 'lure',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    color: initialData?.color || '',
    size: initialData?.size || '',
    weight: initialData?.weight || undefined,
    notes: initialData?.notes || '',
    condition: initialData?.condition || 'new',
    is_favorite: initialData?.isFavorite || false,
  })

  const equipmentTypes = [
    { value: 'lure', label: t('equipment.types.lure') },
    { value: 'rod', label: t('equipment.types.rod') },
    { value: 'reel', label: t('equipment.types.reel') },
    { value: 'line', label: t('equipment.types.line') },
    { value: 'bait', label: t('equipment.types.bait') },
    { value: 'tackle', label: t('equipment.types.tackle') },
    { value: 'other', label: t('equipment.types.other') },
  ]

  const conditions = [
    { value: 'new', label: 'Neu' },
    { value: 'good', label: 'Gut' },
    { value: 'fair', label: 'Gebraucht' },
    { value: 'poor', label: 'Schlecht' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editMode && equipmentId) {
        await updateEquipment(equipmentId, formData)
      } else {
        await addEquipment({
          ...formData,
          user_id: user?.id!
        } as EquipmentInsert)
      }
      onSuccess()
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: keyof EquipmentInsert, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editMode ? 'Equipment bearbeiten' : 'Neues Equipment'}
        </CardTitle>
        <CardDescription>
          Fülle die Details für dein Angelzubehör aus
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {t('equipment.fields.name')} *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2"
              placeholder="z.B. Rapala Original Floater"
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-2">
              {t('equipment.fields.type')} *
            </label>
            <select
              id="type"
              value={formData.type || 'lure'}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2"
            >
              {equipmentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium mb-2">
                {t('equipment.fields.brand')}
              </label>
              <input
                id="brand"
                type="text"
                value={formData.brand || ''}
                onChange={(e) => updateField('brand', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2"
                placeholder="z.B. Rapala"
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-2">
                {t('equipment.fields.model')}
              </label>
              <input
                id="model"
                type="text"
                value={formData.model || ''}
                onChange={(e) => updateField('model', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2"
                placeholder="z.B. F11"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !formData.name}
              loading={isLoading}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              {t('common.save')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
