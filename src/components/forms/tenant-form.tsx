'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, FileText, MapPin, Phone, Mail } from 'lucide-react'

const tenantSchema = z.object({
  nameOrBusiness: z.string().min(2, 'El nombre o razón social debe tener al menos 2 caracteres'),
  dniOrCuit: z.string().min(7, 'DNI/CUIT inválido').max(13, 'DNI/CUIT inválido'),
  contactName: z.string().min(2, 'El nombre de contacto debe tener al menos 2 caracteres'),
  contactPhone: z.string().min(8, 'Teléfono inválido'),
  contactEmail: z.string().email('Email inválido'),
  contactAddress: z.string().min(5, 'Dirección de contacto inválida'),
  address: z.string().min(5, 'Dirección del cliente inválida'),
})

export type TenantFormData = z.infer<typeof tenantSchema>

interface TenantFormProps {
  onSubmit: (data: TenantFormData) => void
  onCancel: () => void
  initialData?: Partial<TenantFormData>
  isLoading?: boolean
}

export function TenantForm({ onSubmit, onCancel, initialData, isLoading }: TenantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información básica del cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Información del Cliente
          </CardTitle>
          <CardDescription>
            Datos principales del inquilino o razón social
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameOrBusiness">
                Nombre o Razón Social <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nameOrBusiness"
                {...register('nameOrBusiness')}
                placeholder="Juan Pérez / Empresa SA"
                className={errors.nameOrBusiness ? 'border-red-500' : ''}
              />
              {errors.nameOrBusiness && (
                <p className="text-sm text-red-500">{errors.nameOrBusiness.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dniOrCuit">
                DNI / CUIT <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dniOrCuit"
                {...register('dniOrCuit')}
                placeholder="12345678 / 20-12345678-9"
                className={errors.dniOrCuit ? 'border-red-500' : ''}
              />
              {errors.dniOrCuit && (
                <p className="text-sm text-red-500">{errors.dniOrCuit.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Dirección del Cliente <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="address"
                {...register('address')}
                placeholder="Calle, Número, Piso, Depto, Ciudad, Provincia"
                className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Persona de contacto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-600" />
            Persona de Contacto
          </CardTitle>
          <CardDescription>
            Datos de la persona responsable del contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactName"
              {...register('contactName')}
              placeholder="Nombre y apellido"
              className={errors.contactName ? 'border-red-500' : ''}
            />
            {errors.contactName && (
              <p className="text-sm text-red-500">{errors.contactName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="contactPhone"
                  {...register('contactPhone')}
                  placeholder="+54 9 11 1234-5678"
                  className={`pl-10 ${errors.contactPhone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.contactPhone && (
                <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="contactEmail"
                  type="email"
                  {...register('contactEmail')}
                  placeholder="contacto@ejemplo.com"
                  className={`pl-10 ${errors.contactEmail ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.contactEmail && (
                <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactAddress">
              Dirección de Contacto <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="contactAddress"
                {...register('contactAddress')}
                placeholder="Dirección completa"
                className={`pl-10 ${errors.contactAddress ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.contactAddress && (
              <p className="text-sm text-red-500">{errors.contactAddress.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Cliente' : 'Crear Cliente'}
        </Button>
      </div>
    </form>
  )
}
