'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { buildingSchema, type BuildingFormData } from '@/lib/validations/building'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FloorConfiguration } from '@/types'
import { buildingsService } from '@/services'
interface BuildingFormProps {
  onSuccess?: (buildingId: number) => void
  onCancel?: () => void
  initialData?: Partial<BuildingFormData>
  isEditing?: boolean
  buildingId?: number
}

export function BuildingForm({ onSuccess, onCancel, initialData, isEditing = false, buildingId }: BuildingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
    defaultValues: initialData || {
      name: '',
      address: '',
      province: '',
      city: '',
      owner: '',
      floors: 1,
      totalArea: 0,
      floorConfiguration: [{ floor: 1, apartmentsCount: 1 }]
    }
  })

  const { fields, replace } = useFieldArray({
    control,
    name: 'floorConfiguration'
  })

  const floorsCount = watch('floors')

  // Update floor configuration when floors count changes
  const handleFloorsChange = (floors: number) => {
    setValue('floors', floors)
    const currentConfig = watch('floorConfiguration') || []
    const newConfiguration: FloorConfiguration[] = []
    
    for (let i = 1; i <= floors; i++) {
      const existingConfig = currentConfig.find((f: FloorConfiguration) => f.floor === i)
      newConfiguration.push({
        floor: i,
        apartmentsCount: existingConfig?.apartmentsCount || 1
      })
    }
    
    replace(newConfiguration)
  }

  const onSubmit = async (data: BuildingFormData) => {
    setIsSubmitting(true)
    
    try {
      let building
      
      if (isEditing && buildingId) {
        // Update existing building
        building = await buildingsService.update(buildingId, {
          name: data.name,
          address: data.address,
          city: data.city,
          province: data.province,
          owner: data.owner,
          floors: data.floors,
          totalArea: data.totalArea,
          floorConfiguration: data.floorConfiguration
        })
      } else {
        // Create new building
        building = await buildingsService.create({
          name: data.name,
          address: data.address,
          province: data.province,
          city: data.city,
          owner: data.owner,
          floors: data.floors,
          totalArea: data.totalArea,
          floorConfiguration: data.floorConfiguration
        })
      }
      
      if (building) {
        onSuccess?.(Number(building.id))
      }
    } catch (error) {
      logger.error(isEditing ? 'Error updating building' : 'Error creating building', error)
      alert(isEditing ? 'Error al actualizar el edificio' : 'Error al crear el edificio')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Básica del Edificio</CardTitle>
          <CardDescription>
            Complete los datos básicos del edificio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Edificio</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ej: Edificio Santa Mónica"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Titular</Label>
              <Input
                id="owner"
                {...register('owner')}
                placeholder="Nombre del propietario"
              />
              {errors.owner && (
                <p className="text-sm text-red-600">{errors.owner.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Dirección completa"
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Ciudad"
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provincia</Label>
              <Input
                id="province"
                {...register('province')}
                placeholder="Provincia"
              />
              {errors.province && (
                <p className="text-sm text-red-600">{errors.province.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalArea">Área Total (m²)</Label>
              <Input
                id="totalArea"
                type="number"
                step="0.01"
                {...register('totalArea', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.totalArea && (
                <p className="text-sm text-red-600">{errors.totalArea.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Pisos</CardTitle>
          <CardDescription>
            Configure la cantidad de pisos y departamentos por piso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floors">Cantidad de Pisos</Label>
            <Input
              id="floors"
              type="number"
              min="1"
              value={floorsCount}
              onChange={(e) => handleFloorsChange(parseInt(e.target.value) || 1)}
              placeholder="1"
            />
            {errors.floors && (
              <p className="text-sm text-red-600">{errors.floors.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Departamentos por Piso</Label>
            {fields.map((field, index) => {
              const floorConfig = watch('floorConfiguration')?.[index]
              return (
                <div key={field.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Label className="min-w-0 flex-1">
                    Piso {floorConfig?.floor || index + 1}:
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    className="w-24"
                    {...register(`floorConfiguration.${index}.apartmentsCount`, { valueAsNumber: true })}
                    placeholder="1"
                  />
                  <span className="text-sm text-gray-500">departamentos</span>
                </div>
              )
            })}
          </div>
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
            ? (isEditing ? 'Actualizando...' : 'Creando...') 
            : (isEditing ? 'Actualizar Edificio' : 'Crear Edificio')
          }
        </Button>
      </div>
    </form>
  )
}
