'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@catchsmart/ui/src/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@catchsmart/ui/src/components/card'
import { equipmentFormSchema, type EquipmentFormData } from '@catchsmart/shared/src/validations/equipment'
import { EQUIPMENT_TYPES } from '@catchsmart/shared/src/constants'
import { useEquipmentStore } from '@/lib/stores/equipment-store'

interface EquipmentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<EquipmentFormData>
  editMode?: boolean
  equipmentId?: string
}

export function EquipmentForm({ 
  onSuccess, 
  onCancel, 
  initialData,
  editMode = false,
  equipmentId
}: EquipmentFormProps) {
  const t = useTranslations()
  const { addEquipment, updateEquipment } = useEquipmentStore()
  
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: initialData?.name || '',
    type: initialData?.type || 'lure',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    color: initialData?.color || '',
    size: initialData?.size || '',
    weight: initialData?.weight || null,
    notes: initialData?.notes || '',
    attributes: initialData?.attributes || {},
    tags: initialData?.tags || [],
    isFavorite: initialData?.isFavorite || false,
    condition: initialData?.condition || 'good',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      // Validate form data
      const validatedData = equipmentFormSchema.parse(formData)
      
      if (editMode && equipmentId) {
        await updateEquipment(equipmentId, {
          ...validatedData,
          is_favorite: validatedData.isFavorite,
        })
      } else {
        await addEquipment({
          ...validatedData,
          is_favorite: validatedData.isFavorite,
        })
      }
      
      onSuccess?.()
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        // Other errors
        setErrors({ general: error.message })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editMode ? 'Ausrüstung bearbeiten' : t('equipment.add.title')}
        </CardTitle>
        <CardDescription>
          {editMode ? 'Bearbeite die Details deiner Ausrüstung' : 'Füge neue Ausrüstung zu deiner Sammlung hinzu'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="rounded-lg bg-cs-error/10 p-3 text-sm text-cs-error">
              {errors.general}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t('equipment.fields.name')} *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="z.B. Rapala Original Floater"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-xs text-cs-error">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                {t('equipment.fields.type')} *
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                disabled={isSubmitting}
              >
                {EQUIPMENT_TYPES.map(type => (
                  <option key={type} value={type}>
                    {t(`equipment.types.${type}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="brand" className="text-sm font-medium">
                {t('equipment.fields.brand')}
              </label>
              <input
                id="brand"
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="z.B. Rapala"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="model" className="text-sm font-medium">
                {t('equipment.fields.model')}
              </label>
              <input
                id="model"
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="z.B. Original Floater F11"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium">
                {t('equipment.fields.color')}
              </label>
              <input
                id="color"
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="z.B. Silber"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="size" className="text-sm font-medium">
                {t('equipment.fields.size')}
              </label>
              <input
                id="size"
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="z.B. 11cm"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">
                {t('equipment.fields.weight')} (g)
              </label>
              <input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  weight: e.target.value ? parseFloat(e.target.value) : null 
                })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="z.B. 12"
                disabled={isSubmitting}
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="condition" className="text-sm font-medium">
                Zustand
              </label>
              <select
                id="condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                disabled={isSubmitting}
              >
                <option value="new">Neu</option>
                <option value="good">Gut</option>
                <option value="fair">Befriedigend</option>
                <option value="poor">Schlecht</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="Tag hinzufügen und Enter drücken"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addTag}
                disabled={isSubmitting}
              >
                Hinzufügen
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-cs-primary/10 px-3 py-1 text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-cs-primary hover:text-cs-primary-hover"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              {t('equipment.fields.notes')}
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
              placeholder="Zusätzliche Notizen..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="favorite"
              type="checkbox"
              checked={formData.isFavorite}
              onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
              className="h-4 w-4 rounded border-input text-cs-primary"
              disabled={isSubmitting}
            />
            <label htmlFor="favorite" className="text-sm font-medium">
              Als Favorit markieren
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {editMode ? 'Speichern' : 'Hinzufügen'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
