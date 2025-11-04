import { z } from 'zod'

/**
 * Schema de validación para garantes
 */
export const guarantorSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  dni: z.string().min(7, 'DNI inválido').max(10, 'DNI inválido'),
  address: z.string().min(5, 'Dirección inválida'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono inválido'),
})

export type GuarantorFormValues = z.infer<typeof guarantorSchema>
