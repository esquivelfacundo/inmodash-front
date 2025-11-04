'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading } from '@/components/ui/loading'
import { useContract } from '@/hooks/useContracts'
import { contractsService } from '@/services'

export default function EditContractPage() {
  const params = useParams()
  const router = useRouter()
  const contractId = Number(params.id)

  const { contract, loading } = useContract(contractId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    initialAmount: 0,
  })

  // Initialize form when contract loads
  useEffect(() => {
    if (contract) {
      setFormData({
        startDate: contract.startDate.split('T')[0],
        endDate: contract.endDate.split('T')[0],
        initialAmount: contract.initialAmount,
      })
    }
  }, [contract])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await contractsService.update(contractId, {
        startDate: formData.startDate,
        endDate: formData.endDate,
        initialAmount: formData.initialAmount,
      })
      router.push(`/contracts/${contractId}`)
    } catch (error) {
      alert('Error al actualizar el contrato. Por favor intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/contracts/${contractId}`)
  }

  if (loading) {
    return <Loading size="lg" text="Cargando contrato..." />
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-white/90 mb-2">Contrato no encontrado</h2>
        <Link href="/contracts">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Contratos
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/contracts/${contractId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar Contrato</h1>
          <p className="text-white/60 mt-2">
            Modifica la información del contrato #{contractId}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Contrato</CardTitle>
            <CardDescription>
              Actualiza las fechas y monto del contrato
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Fecha de Inicio
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Fecha de Finalización
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialAmount">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Monto Inicial
              </Label>
              <Input
                id="initialAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.initialAmount}
                onChange={(e) => setFormData({ ...formData, initialAmount: Number(e.target.value) })}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Las reglas de actualización no se pueden modificar después de crear el contrato. 
              Si necesita cambiar las reglas, deberá crear un nuevo contrato.
            </p>
          </CardContent>
        </Card>

        <div className="flex space-x-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  )
}
