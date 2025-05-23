'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Save, X } from 'lucide-react'
import { Button } from '@catchsmart/ui/src/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@catchsmart/ui/src/components/card'
import type { Database } from '@catchsmart/database/types/database'

type Equipment = Database['public']['Tables']['equipment_items']['Row']
type EquipmentInsert = Database['public']['Tables']['equipment_items']['Insert']

interface EquipmentFormProps {
  initialData?: Partial<Equipment> | null
  onSave: (data: EquipmentInsert) => Promise<void>
  onCancel: () => void
}

export function EquipmentForm({ initialData, onSave, onCancel }: EquipmentFormProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<EquipmentInsert>>({
    name: '',
    type: 'lure',
    brand: '',
    model: '',
    color: '',
    size: '',
    weight: undefined,
    notes: '',
    condition: 'new',
    is_favorite: false,
    ...initialData
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
      await onSave(formData as EquipmentInsert)
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
          {initialData ? 'Equipment bearbeiten' : 'Neues Equipment'}
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

          {/* Color & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="color" className="block text-sm font-medium mb-2">
                {t('equipment.fields.color')}
              </label>
              <input
                id="color"
                type="text"
                value={formData.color || ''}
                onChange={(e) => updateField('color', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2"
                placeholder="z.B. Silber"
              />
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-medium mb-2">
                {t('equipment.fields.size')}
              </label>
              <input
                id="size"
                type="text"
                value={formData.size || ''}
                onChange={(e) => updateField('size', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2"
                placeholder="z.B. 11cm"
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-2">
              {t('equipment.fields.weight')} (g)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              value={formData.weight || ''}
              onChange={(e) => updateField('weight', e.target.value ? parseFloat(e.target.value) : null)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2"
              placeholder="z.B. 6.5"
            />
          </div>

          {/* Condition */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium mb-2">
              Zustand
            </label>
            <select
              id="condition"
              value={formData.condition || 'new'}
              onChange={(e) => updateField('condition', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2"
            >
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              {t('equipment.fields.notes')}
            </label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-primary focus-visible:ring-offset-2"
              placeholder="Zusätzliche Notizen..."
            />
          </div>

          {/* Favorite */}
          <div className="flex items-center">
            <input
              id="favorite"
              type="checkbox"
              checked={formData.is_favorite || false}
              onChange={(e) => updateField('is_favorite', e.target.checked)}
              className="h-4 w-4 rounded border-input text-cs-primary focus:ring-cs-primary"
            />
            <label htmlFor="favorite" className="ml-2 text-sm">
              Als {t('equipment.fields.favorite')} markieren
            </label>
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
