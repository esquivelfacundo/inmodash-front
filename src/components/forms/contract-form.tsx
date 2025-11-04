'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, DollarSign, TrendingUp, Plus, X, Zap } from 'lucide-react'
import { UpdateRuleType } from '@/types'
import { contractSchema, type ContractFormValues, type UpdatePeriodFormValues } from '@/lib/validations'
import { generateUpdatePeriods } from '@/lib/helpers'

export type UpdatePeriodFormData = UpdatePeriodFormValues
export type ContractFormData = ContractFormValues

interface ContractFormProps {
  onSubmit: (data: ContractFormData) => void
  onCancel: () => void
  availableGuarantors: Array<{ id: string; name: string }>
  initialData?: Partial<ContractFormData>
  isLoading?: boolean
}

export function ContractForm({ 
  onSubmit, 
  onCancel, 
  availableGuarantors,
  initialData, 
  isLoading 
}: ContractFormProps) {
  const [updatePeriods, setUpdatePeriods] = useState<UpdatePeriodFormData[]>([])
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      updateFrequency: 'mensual',
      updatePeriods: [],
      guarantorIds: [],
      lateInterestFrequency: 'mensual',
      ...initialData,
    },
  })
  
  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const updateFrequency = watch('updateFrequency')
  
  // Generar períodos automáticamente cuando cambian las fechas o la frecuencia
  useEffect(() => {
    if (startDate && endDate && updateFrequency) {
      const periods = generateUpdatePeriods(startDate, endDate, updateFrequency)
      setUpdatePeriods(periods)
      setValue('updatePeriods', periods)
    }
  }, [startDate, endDate, updateFrequency, setValue])
  
  const addUpdatePeriod = () => {
    const newPeriods = [...updatePeriods, { date: '', type: 'fijo' as UpdateRuleType, value: undefined, indexName: undefined }]
    setUpdatePeriods(newPeriods)
    setValue('updatePeriods', newPeriods)
  }
  
  const removeUpdatePeriod = (index: number) => {
    const newPeriods = updatePeriods.filter((_, i) => i !== index)
    setUpdatePeriods(newPeriods)
    setValue('updatePeriods', newPeriods)
  }
  
  const handleUpdatePeriodChange = (index: number, field: keyof UpdatePeriodFormData, value: any) => {
    const newPeriods = [...updatePeriods]
    newPeriods[index] = { ...newPeriods[index], [field]: value }
    setUpdatePeriods(newPeriods)
    setValue('updatePeriods', newPeriods)
  }

  // Calculate months remaining
  const calculateMonthsRemaining = (contractEndDate: string) => {
    if (!contractEndDate) return 0
    const end = new Date(contractEndDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    return Math.max(0, diffMonths)
  }

  const monthsRemaining = endDate ? calculateMonthsRemaining(endDate) : 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Fechas del contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Período del Contrato
          </CardTitle>
          <CardDescription>
            Fechas de inicio y finalización del contrato de locación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Fecha de Inicio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                Fecha de Finalización <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {monthsRemaining > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Meses restantes:</strong> {monthsRemaining} meses
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan de pagos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Plan de Pagos
          </CardTitle>
          <CardDescription>
            Monto inicial y reglas de actualización
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initialAmount">
              Monto Inicial (ARS) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="initialAmount"
              type="number"
              step="0.01"
              {...register('initialAmount', { valueAsNumber: true })}
              placeholder="150000"
              className={errors.initialAmount ? 'border-red-500' : ''}
            />
            {errors.initialAmount && (
              <p className="text-sm text-red-500">{errors.initialAmount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="updateFrequency">
              Frecuencia de Actualización <span className="text-red-500">*</span>
            </Label>
            <select
              id="updateFrequency"
              {...register('updateFrequency')}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="mensual">Mensual</option>
              <option value="trimestral">Trimestral (cada 3 meses)</option>
              <option value="cuatrimestral">Cuatrimestral (cada 4 meses)</option>
              <option value="semestral">Semestral (cada 6 meses)</option>
              <option value="anual">Anual</option>
            </select>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Los períodos se generarán automáticamente según las fechas del contrato
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyCoefficient">Coeficiente Mensual (opcional)</Label>
            <Input
              id="monthlyCoefficient"
              type="number"
              step="0.0001"
              {...register('monthlyCoefficient', { valueAsNumber: true })}
              placeholder="1.05"
            />
          </div>

          {/* Interés por Mora */}
          <div className="border-t pt-4 space-y-3">
            <Label className="text-base font-semibold">Interés por Mora</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lateInterestPercent">Porcentaje (%)</Label>
                <Input
                  id="lateInterestPercent"
                  type="number"
                  step="0.01"
                  {...register('lateInterestPercent', { valueAsNumber: true })}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lateInterestFrequency">Frecuencia de Aplicación</Label>
                <select
                  id="lateInterestFrequency"
                  {...register('lateInterestFrequency')}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              El interés por mora se aplicará de forma {watch('lateInterestFrequency') || 'mensual'} sobre pagos atrasados
            </p>
          </div>

          {/* Períodos de actualización */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">
                  Períodos de Actualización <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {updatePeriods.length > 0 
                    ? `${updatePeriods.length} período(s) generado(s) automáticamente`
                    : 'Completa las fechas y frecuencia para generar los períodos'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {updatePeriods.map((period, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Período {index + 1}</span>
                    {updatePeriods.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeUpdatePeriod(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Fecha de Actualización</Label>
                      <Input
                        type="date"
                        value={period.date}
                        onChange={(e) => handleUpdatePeriodChange(index, 'date', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Actualización</Label>
                      <select
                        value={period.type}
                        onChange={(e) => handleUpdatePeriodChange(index, 'type', e.target.value as UpdateRuleType)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="fijo">Monto Fijo</option>
                        <option value="indice">Por Índice (IPC, ICL, etc.)</option>
                        <option value="porcentaje">Por Porcentaje</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {period.type === 'indice' && (
                      <div className="space-y-2">
                        <Label>Nombre del Índice</Label>
                        <Input
                          value={period.indexName || ''}
                          onChange={(e) => handleUpdatePeriodChange(index, 'indexName', e.target.value)}
                          placeholder="IPC, ICL, etc."
                        />
                      </div>
                    )}

                    {(period.type === 'porcentaje' || period.type === 'fijo') && (
                      <div className="space-y-2">
                        <Label>{period.type === 'porcentaje' ? 'Porcentaje (%)' : 'Valor'}</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={period.value || ''}
                          onChange={(e) => handleUpdatePeriodChange(index, 'value', parseFloat(e.target.value) || undefined)}
                          placeholder={period.type === 'porcentaje' ? '10' : '0'}
                        />
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addUpdatePeriod}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Período de Actualización
            </Button>

            {errors.updatePeriods && (
              <p className="text-sm text-red-500">{errors.updatePeriods.message as string}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Garantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Garantes
          </CardTitle>
          <CardDescription>
            Selecciona los garantes que respaldarán este contrato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>
              Garantes del Contrato <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              {availableGuarantors.map((guarantor) => (
                <label key={guarantor.id} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    value={guarantor.id}
                    {...register('guarantorIds')}
                    className="h-4 w-4"
                  />
                  <span>{guarantor.name}</span>
                </label>
              ))}
            </div>
            {errors.guarantorIds && (
              <p className="text-sm text-red-500">{errors.guarantorIds.message}</p>
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
          {isLoading ? 'Creando...' : 'Crear Contrato'}
        </Button>
      </div>
    </form>
  )
}
