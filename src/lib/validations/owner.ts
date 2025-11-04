import { z } from 'zod'

/**
 * Schema de validación para propietarios
 */
export const ownerSchema = z.object({
  name: z.string().min(1, 'El nombre del propietario es requerido'),
  dniOrCuit: z.string().min(1, 'El DNI/CUIT es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('Email inválido'),
  address: z.string().min(1, 'La dirección es requerida'),
  bankAccount: z.string().optional(),
  commissionPercentage: z.number().min(0, 'La comisión debe ser mayor o igual a 0').max(100, 'La comisión no puede ser mayor a 100').default(0)
})

export type OwnerFormData = z.infer<typeof ownerSchema>
export type OwnerFormValues = OwnerFormData
