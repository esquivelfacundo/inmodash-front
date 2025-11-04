import { z } from 'zod'

/**
 * Schema de validación para documentos
 */
export const documentSchema = z.object({
  type: z.string().min(1, 'El tipo de documento es requerido'),
  fileName: z.string().min(1, 'El nombre del archivo es requerido'),
  fileUrl: z.string().min(1, 'La URL del archivo es requerida'),
  fileSize: z.number().min(1, 'El tamaño del archivo es requerido'),
  mimeType: z.string().min(1, 'El tipo MIME es requerido'),
  description: z.string().optional(),
  tenantId: z.string().optional(),
  ownerId: z.string().optional(),
  contractId: z.string().optional(),
  apartmentId: z.string().optional()
})

export type DocumentFormData = z.infer<typeof documentSchema>
export type DocumentFormValues = DocumentFormData
