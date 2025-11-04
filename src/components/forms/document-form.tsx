'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { documentSchema, type DocumentFormData } from '@/lib/validations/document'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { documentsService } from '@/services'
import { logger } from '@/lib/logger'

interface DocumentFormProps {
  onSuccess?: (documentId: number) => void
  onCancel?: () => void
  initialData?: Partial<DocumentFormData>
  isEditing?: boolean
  documentId?: number
  tenantId?: number
  ownerId?: number
  contractId?: number
  apartmentId?: number
}

const DOCUMENT_TYPES = [
  { value: 'dni', label: 'DNI' },
  { value: 'recibo_sueldo', label: 'Recibo de Sueldo' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'garantia', label: 'Garantía' },
  { value: 'otro', label: 'Otro' }
]

export function DocumentForm({ 
  onSuccess, 
  onCancel, 
  initialData, 
  isEditing = false, 
  documentId,
  tenantId,
  ownerId,
  contractId,
  apartmentId
}: DocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: initialData || {
      type: 'otro',
      fileName: '',
      fileUrl: '',
      fileSize: 0,
      mimeType: '',
      description: '',
      tenantId: tenantId?.toString(),
      ownerId: ownerId?.toString(),
      contractId: contractId?.toString(),
      apartmentId: apartmentId?.toString()
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const onSubmit = async (data: DocumentFormData) => {
    setIsSubmitting(true)
    
    try {
      if (isEditing && documentId) {
        // Update existing document (only description)
        const document = await documentsService.update(documentId, {
          description: data.description
        })
        
        if (document) {
          onSuccess?.(Number(document.id))
        }
      } else {
        // For new documents, we need to upload the file first
        // In a real implementation, you would upload to a storage service
        // For now, we'll use a placeholder URL
        
        if (!selectedFile) {
          alert('Por favor seleccione un archivo')
          setIsSubmitting(false)
          return
        }

        // Simulate file upload - in production, upload to S3, Cloudinary, etc.
        const fileUrl = `/uploads/${selectedFile.name}`
        
        const document = await documentsService.create({
          type: data.type,
          fileName: selectedFile.name,
          fileUrl: fileUrl,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type,
          description: data.description,
          tenantId: data.tenantId ? parseInt(data.tenantId) : undefined,
          ownerId: data.ownerId ? parseInt(data.ownerId) : undefined,
          contractId: data.contractId ? parseInt(data.contractId) : undefined,
          apartmentId: data.apartmentId ? parseInt(data.apartmentId) : undefined
        })
        
        if (document) {
          onSuccess?.(Number(document.id))
        }
      }
    } catch (error) {
      logger.error(isEditing ? 'Error updating document' : 'Error creating document', error)
      alert(isEditing ? 'Error al actualizar el documento' : 'Error al crear el documento')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Documento' : 'Subir Documento'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Actualice la descripción del documento' : 'Complete los datos del documento a subir'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEditing && (
              <>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="file">Archivo</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600">
                      Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Documento</Label>
                  <select
                    id="type"
                    {...register('type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DOCUMENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción (Opcional)</Label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción del documento..."
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {!isEditing && !tenantId && !ownerId && !contractId && !apartmentId && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tenantId">ID Inquilino (Opcional)</Label>
                  <Input
                    id="tenantId"
                    type="number"
                    {...register('tenantId')}
                    placeholder="Ej: 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerId">ID Propietario (Opcional)</Label>
                  <Input
                    id="ownerId"
                    type="number"
                    {...register('ownerId')}
                    placeholder="Ej: 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractId">ID Contrato (Opcional)</Label>
                  <Input
                    id="contractId"
                    type="number"
                    {...register('contractId')}
                    placeholder="Ej: 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apartmentId">ID Departamento (Opcional)</Label>
                  <Input
                    id="apartmentId"
                    type="number"
                    {...register('apartmentId')}
                    placeholder="Ej: 1"
                  />
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> En una implementación completa, los archivos se subirían a un servicio de almacenamiento como AWS S3, Cloudinary, etc.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? (isEditing ? 'Actualizando...' : 'Subiendo...') 
            : (isEditing ? 'Actualizar Documento' : 'Subir Documento')
          }
        </Button>
      </div>
    </form>
  )
}
