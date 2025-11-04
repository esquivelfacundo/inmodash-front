import { z } from 'zod'

/**
 * Schema de validación para clientes/inquilinos
 */
export const tenantSchema = z.object({
  nameOrBusiness: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  dniOrCuit: z.string().min(7, 'DNI/CUIT inválido').max(13, 'DNI/CUIT inválido'),
  address: z.string().min(5, 'Dirección inválida'),
  contactName: z.string().min(2, 'Nombre de contacto requerido'),
  contactPhone: z.string().min(8, 'Teléfono inválido'),
  contactEmail: z.string().email('Email inválido'),
  contactAddress: z.string().min(5, 'Dirección de contacto requerida'),
})

export type TenantFormValues = z.infer<typeof tenantSchema>
