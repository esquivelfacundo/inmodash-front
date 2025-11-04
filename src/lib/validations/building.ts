import { z } from 'zod'

/**
 * Schema de validación para edificios
 */
export const buildingSchema = z.object({
  name: z.string().min(1, 'El nombre del edificio es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  province: z.string().min(1, 'La provincia es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  owner: z.string().min(1, 'El titular es requerido'),
  floors: z.number().min(1, 'Debe tener al menos 1 piso'),
  totalArea: z.number().min(1, 'El área total debe ser mayor a 0'),
  floorConfiguration: z.array(z.object({
    floor: z.number(),
    apartmentsCount: z.number().min(1, 'Debe tener al menos 1 departamento por piso')
  }))
})

export type BuildingFormData = z.infer<typeof buildingSchema>
export type BuildingFormValues = BuildingFormData
