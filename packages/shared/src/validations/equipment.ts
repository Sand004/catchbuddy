import { z } from 'zod'
import { EQUIPMENT_TYPES } from '../constants'

export const equipmentFormSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100),
  type: z.enum(EQUIPMENT_TYPES),
  brand: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  weight: z.number().positive().optional().nullable(),
  notes: z.string().max(500).optional(),
  attributes: z.record(z.any()).default({}),
  tags: z.array(z.string()).default([]),
  isFavorite: z.boolean().default(false),
  condition: z.enum(['new', 'good', 'fair', 'poor']).default('good'),
})

export type EquipmentFormData = z.infer<typeof equipmentFormSchema>
