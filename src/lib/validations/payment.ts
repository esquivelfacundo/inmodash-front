import { z } from 'zod'
import { PaymentStatus } from '@/types'

/**
 * Schema de validación para pagos
 */
export const paymentSchema = z.object({
  contractId: z.string().min(1, 'Debe seleccionar un contrato'),
  month: z.string().min(1, 'La fecha del mes es requerida'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  commissionAmount: z.number().min(0).optional(),
  ownerAmount: z.number().min(0).optional(),
  paymentDate: z.string().optional(),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  notes: z.string().optional()
})

export type PaymentFormData = z.infer<typeof paymentSchema>
export type PaymentFormValues = PaymentFormData
