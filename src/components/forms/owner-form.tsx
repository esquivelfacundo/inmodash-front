'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ownerSchema, type OwnerFormData } from '@/lib/validations/owner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ownersService } from '@/services'

interface OwnerFormProps {
  onSuccess?: (ownerId: number) => void
  onCancel?: () => void
  initialData?: Partial<OwnerFormData>
  isEditing?: boolean
  ownerId?: number
}

export function OwnerForm({ onSuccess, onCancel, initialData, isEditing = false, ownerId }: OwnerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OwnerFormData>({
    resolver: zodResolver(ownerSchema),
    defaultValues: initialData || {
      name: '',
      dniOrCuit: '',
      phone: '',
      email: '',
      address: '',
      bankAccount: '',
      commissionPercentage: 0
    }
  })

  const onSubmit = async (data: OwnerFormData) => {
    setIsSubmitting(true)
    
    try {
      let owner
      
      if (isEditing && ownerId) {
        // Update existing owner
        owner = await ownersService.update(ownerId, data)
      } else {
        // Create new owner
        owner = await ownersService.create(data)
      }
      
      if (owner) {
        onSuccess?.(Number(owner.id))
      }
    } catch (error) {
      logger.error(isEditing ? 'Error updating owner' : 'Error creating owner', error)
      alert(isEditing ? 'Error al actualizar el propietario' : 'Error al crear el propietario')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Propietario</CardTitle>
          <CardDescription>
            Complete los datos del propietario de la propiedad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ej: Juan Pérez"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dniOrCuit">DNI / CUIT</Label>
              <Input
                id="dniOrCuit"
                {...register('dniOrCuit')}
                placeholder="Ej: 20-12345678-9"
              />
              {errors.dniOrCuit && (
                <p className="text-sm text-red-600">{errors.dniOrCuit.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Ej: +54 9 11 1234-5678"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Ej: propietario@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Dirección completa del propietario"
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccount">Cuenta Bancaria (Opcional)</Label>
              <Input
                id="bankAccount"
                {...register('bankAccount')}
                placeholder="CBU o Alias"
              />
              {errors.bankAccount && (
                <p className="text-sm text-red-600">{errors.bankAccount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="commissionPercentage">Comisión Inmobiliaria (%)</Label>
              <Input
                id="commissionPercentage"
                type="number"
                step="0.01"
                {...register('commissionPercentage', { valueAsNumber: true })}
                placeholder="Ej: 5"
              />
              {errors.commissionPercentage && (
                <p className="text-sm text-red-600">{errors.commissionPercentage.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Porcentaje que cobra la inmobiliaria sobre el alquiler
              </p>
            </div>
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
            : (isEditing ? 'Actualizar Propietario' : 'Crear Propietario')
          }
        </Button>
      </div>
    </form>
  )
}
