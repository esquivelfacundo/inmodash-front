import { z } from 'zod'
import { ApartmentStatus, SaleStatus, PropertyType } from '@/types'

/**
 * Schema de validación para departamentos
 * Soporta tanto departamentos en edificios como independientes
 */
export const apartmentSchema = z.object({
  // Tipo de ubicación
  isInBuilding: z.boolean().default(true),
  
  // Campos para departamentos en edificios
  buildingId: z.string().optional(),
  floor: z.number().optional(),
  apartmentLetter: z.string().optional(),
  
  // Campos para departamentos independientes
  fullAddress: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  
  // Propietario (opcional)
  ownerId: z.string().optional(),
  
  // Tipo de propiedad
  propertyType: z.nativeEnum(PropertyType).default(PropertyType.APARTMENT),
  
  // Campos comunes
  nomenclature: z.string().min(1, 'La nomenclatura es requerida'),
  area: z.number().min(1, 'El área debe ser mayor a 0'),
  rooms: z.number().min(1, 'Debe tener al menos 1 ambiente'),
  status: z.nativeEnum(ApartmentStatus),
  saleStatus: z.nativeEnum(SaleStatus)
}).refine((data) => {
  // Si está en edificio, requiere buildingId, floor y apartmentLetter
  if (data.isInBuilding) {
    return data.buildingId && data.floor && data.apartmentLetter
  }
  // Si es independiente, requiere fullAddress, city y province
  return data.fullAddress && data.city && data.province
}, {
  message: 'Complete todos los campos requeridos según el tipo de propiedad',
  path: ['isInBuilding']
})

export type ApartmentFormData = z.infer<typeof apartmentSchema>
