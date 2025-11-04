'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema, type PaymentFormData } from '@/lib/validations/payment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { paymentsService } from '@/services'
import { logger } from '@/lib/logger'
import { PaymentStatus } from '@/types'

interface PaymentFormProps {
  onSuccess?: (paymentId: number) => void
  onCancel?: () => void
  initialData?: Partial<PaymentFormData>
  isEditing?: boolean
  paymentId?: number
  contractId?: number
}

export function PaymentForm({ 
  onSuccess, 
  onCancel, 
  initialData, 
  isEditing = false, 
  paymentId,
  contractId 
}: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      contractId: contractId?.toString() || '',
      month: '',
      amount: 0,
      status: PaymentStatus.PENDING,
      notes: ''
    }
  })

  const amount = watch('amount')
  const status = watch('status')

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true)
    
    try {
      let payment
      
      if (isEditing && paymentId) {
        // Update existing payment
        payment = await paymentsService.update(paymentId, {
          amount: data.amount,
          paymentDate: data.paymentDate,
          status: data.status,
          notes: data.notes
        })
      } else {
        // Create new payment
        payment = await paymentsService.create({
          contractId: parseInt(data.contractId),
          month: data.month,
          amount: data.amount,
          paymentDate: data.paymentDate,
          status: data.status,
          notes: data.notes
        })
      }
      
      if (payment) {
        onSuccess?.(Number(payment.id))
      }
    } catch (error) {
      logger.error(isEditing ? 'Error updating payment' : 'Error creating payment', error)
      alert(isEditing ? 'Error al actualizar el pago' : 'Error al crear el pago')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Pago</CardTitle>
          <CardDescription>
            Complete los datos del pago de alquiler
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isEditing && !contractId && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="contractId">ID del Contrato</Label>
                <Input
                  id="contractId"
                  type="number"
                  {...register('contractId')}
                  placeholder="Ej: 1"
                />
                {errors.contractId && (
                  <p className="text-sm text-red-600">{errors.contractId.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="month">Mes del Pago</Label>
              <Input
                id="month"
                type="month"
                {...register('month')}
              />
              {errors.month && (
                <p className="text-sm text-red-600">{errors.month.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Seleccione el mes al que corresponde este pago
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Monto del Alquiler</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                placeholder="Ej: 50000"
              />
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={PaymentStatus.PENDING}>Pendiente</option>
                <option value={PaymentStatus.PAID}>Pagado</option>
                <option value={PaymentStatus.OVERDUE}>Vencido</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            {status === PaymentStatus.PAID && (
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Fecha de Pago</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  {...register('paymentDate')}
                />
                {errors.paymentDate && (
                  <p className="text-sm text-red-600">{errors.paymentDate.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones sobre el pago..."
              />
              {errors.notes && (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>
          </div>

          {amount > 0 && (
            <div className="border-t pt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Resumen del Pago</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto del alquiler:</span>
                    <span className="font-medium">${amount.toLocaleString('es-AR')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * La comisión y monto del propietario se calcularán automáticamente según el porcentaje configurado
                  </p>
                </div>
              </div>
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
            ? (isEditing ? 'Actualizando...' : 'Creando...') 
            : (isEditing ? 'Actualizar Pago' : 'Crear Pago')
          }
        </Button>
      </div>
    </form>
  )
}
