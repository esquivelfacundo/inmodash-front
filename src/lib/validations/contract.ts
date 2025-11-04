import { z } from 'zod'

/**
 * Schema de validación para períodos de actualización
 */
export const updatePeriodSchema = z.object({
  date: z.string().min(1, 'Fecha requerida'),
  type: z.enum(['fijo', 'indice', 'porcentaje']),
  value: z.number().optional(),
  indexName: z.string().optional(),
})

/**
 * Schema de validación para contratos
 */
export const contractSchema = z.object({
  startDate: z.string().min(1, 'Fecha de inicio requerida'),
  endDate: z.string().min(1, 'Fecha de finalización requerida'),
  initialAmount: z.number().min(1, 'El monto inicial debe ser mayor a 0'),
  updateFrequency: z.enum(['mensual', 'trimestral', 'cuatrimestral', 'semestral', 'anual']),
  monthlyCoefficient: z.number().optional(),
  lateInterestPercent: z.number().min(0).max(100).optional(),
  lateInterestFrequency: z.enum(['diario', 'semanal', 'mensual']).optional(),
  updatePeriods: z.array(updatePeriodSchema).min(1, 'Debe especificar al menos un período de actualización'),
  guarantorIds: z.array(z.string()).min(1, 'Debe agregar al menos un garante'),
})

export type UpdatePeriodFormValues = z.infer<typeof updatePeriodSchema>
export type ContractFormValues = z.infer<typeof contractSchema>
