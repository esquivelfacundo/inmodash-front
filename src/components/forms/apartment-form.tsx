'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { apartmentSchema, type ApartmentFormData } from '@/lib/validations/apartment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logger } from '@/lib/logger'
import { ApartmentStatus, SaleStatus, Building, Apartment } from '@/types'
import { apartmentsService } from '@/services'
import { PropertySpecifications } from '@/components/property/PropertySpecifications'
import { getDefaultSpecifications } from '@/config/property-specifications'

interface ApartmentFormProps {
  buildings: Building[]
  selectedBuildingId?: string
  onSuccess?: (apartmentId: string) => void
  onCancel?: () => void
  initialData?: Partial<ApartmentFormData> & { propertyType?: string; specifications?: string }
  isEditing?: boolean
  apartmentId?: number
}

export function ApartmentForm({ 
  buildings, 
  selectedBuildingId, 
  onSuccess, 
  onCancel,
  initialData,
  isEditing = false,
  apartmentId
}: ApartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const propertyType = initialData?.propertyType || 'departamento'
  const [specifications, setSpecifications] = useState<Record<string, any>>(
    initialData?.specifications ? JSON.parse(initialData.specifications) : getDefaultSpecifications(propertyType)
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ApartmentFormData>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: initialData || {
      buildingId: selectedBuildingId || '',
      floor: 1,
      apartmentLetter: '',
      area: 0,
      rooms: 1,
      status: ApartmentStatus.AVAILABLE,
      saleStatus: SaleStatus.NOT_FOR_SALE,
      nomenclature: ''
    }
  })

  const selectedBuilding = buildings.find(b => b.id === Number(watch('buildingId')))

  const onSubmit = async (data: ApartmentFormData) => {
    setIsSubmitting(true)
    
    try {
      let apartment
      
      if (isEditing && apartmentId) {
        // Update existing apartment
        apartment = await apartmentsService.update(apartmentId, {
          area: data.area,
          rooms: data.rooms,
          status: data.status,
          saleStatus: data.saleStatus,
          specifications: JSON.stringify(specifications),
        })
      } else {
        // Create new apartment
        apartment = await apartmentsService.create({
          buildingId: data.buildingId ? Number(data.buildingId) : undefined,
          floor: data.floor || undefined,
          apartmentLetter: data.apartmentLetter?.toUpperCase(),
          fullAddress: data.fullAddress,
          city: data.city,
          province: data.province,
          ownerId: data.ownerId ? Number(data.ownerId) : undefined,
          propertyType: data.propertyType,
          area: data.area,
          rooms: data.rooms,
          status: data.status,
          saleStatus: data.saleStatus,
          nomenclature: data.nomenclature,
          specifications: JSON.stringify(specifications),
        })
      }
      
      if (apartment) {
        onSuccess?.(String(apartment.id))
      }
    } catch (error) {
      logger.error(isEditing ? 'Error updating apartment' : 'Error creating apartment', error)
      alert(isEditing ? 'Error al actualizar el departamento' : 'Error al crear el departamento')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Departamento</CardTitle>
          <CardDescription>
            Complete los datos del departamento. El ID único se generará automáticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buildingId">Edificio</Label>
              <Select
                id="buildingId"
                {...register('buildingId')}
                disabled={!!selectedBuildingId}
              >
                <option value="">Seleccionar edificio</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </Select>
              {errors.buildingId && (
                <p className="text-sm text-red-600">{errors.buildingId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomenclature">Nomenclatura</Label>
              <Input
                id="nomenclature"
                {...register('nomenclature')}
                placeholder="Ej: A, B, C, 101, 102..."
              />
              {errors.nomenclature && (
                <p className="text-sm text-red-600">{errors.nomenclature.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Piso</Label>
              <Input
                id="floor"
                type="number"
                min="1"
                max={selectedBuilding?.floors || 50}
                {...register('floor', { valueAsNumber: true })}
                placeholder="1"
              />
              {errors.floor && (
                <p className="text-sm text-red-600">{errors.floor.message}</p>
              )}
              {selectedBuilding && (
                <p className="text-xs text-gray-500">
                  Máximo: {selectedBuilding.floors} pisos
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartmentLetter">Letra del Departamento</Label>
              <Input
                id="apartmentLetter"
                {...register('apartmentLetter')}
                placeholder="A"
                maxLength={1}
                className="uppercase"
              />
              {errors.apartmentLetter && (
                <p className="text-sm text-red-600">{errors.apartmentLetter.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                min="0"
                {...register('area', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.area && (
                <p className="text-sm text-red-600">{errors.area.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rooms">Cantidad de Ambientes</Label>
              <Input
                id="rooms"
                type="number"
                min="1"
                {...register('rooms', { valueAsNumber: true })}
                placeholder="1"
              />
              {errors.rooms && (
                <p className="text-sm text-red-600">{errors.rooms.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select 
                id="status" 
                {...register('status')}
              >
                <option value={ApartmentStatus.AVAILABLE}>Disponible</option>
                <option value={ApartmentStatus.RENTED}>Alquilado</option>
                <option value={ApartmentStatus.UNDER_RENOVATION}>En Refacción</option>
                <option value={ApartmentStatus.PERSONAL_USE}>Uso Propio</option>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="saleStatus">Comercialización</Label>
              <Select 
                id="saleStatus" 
                {...register('saleStatus')}
              >
                <option value={SaleStatus.NOT_FOR_SALE}>No está en venta</option>
                <option value={SaleStatus.FOR_SALE}>En venta</option>
              </Select>
              {errors.saleStatus && (
                <p className="text-sm text-red-600">{errors.saleStatus.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Especificaciones */}
      <PropertySpecifications
        propertyType={propertyType}
        value={specifications}
        onChange={(newSpecs) => setSpecifications(newSpecs)}
      />

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Departamento'}
        </Button>
      </div>
    </form>
  )
}
