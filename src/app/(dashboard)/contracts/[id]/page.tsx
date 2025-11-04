'use client'

import { use, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Building2, User, Calendar, DollarSign, Edit, Trash2, TrendingUp, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { useContract, useContracts } from '@/hooks/useContracts'
import { useApartment } from '@/hooks/useApartments'
import { useTenant } from '@/hooks/useTenants'
import { useBuilding } from '@/hooks/useBuildings'

export default function ContractDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contractId = Number(params.id)

  const { contract, loading: contractLoading } = useContract(contractId)
  const { deleteContract } = useContracts()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Load related data
  const { apartment } = useApartment(contract?.apartmentId || 0)
  const { tenant } = useTenant(contract?.tenantId || 0)
  const { building } = useBuilding(apartment?.buildingId ? Number(apartment.buildingId) : 0)

  const handleDelete = async () => {
    try {
      await deleteContract(contractId)
      router.push('/contracts')
    } catch (error) {
      alert('Error al eliminar el contrato. Por favor intente nuevamente.')
    }
  }

  const getContractStatus = () => {
    if (!contract) return { label: 'Desconocido', color: 'bg-slate-800/50 text-white' }
    
    const now = new Date()
    const endDate = new Date(contract.endDate)
    const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilEnd < 0) {
      return { label: 'Vencido', color: 'bg-red-500/20 text-red-300' }
    } else if (daysUntilEnd <= 30) {
      return { label: 'Por Vencer', color: 'bg-yellow-500/20 text-yellow-300' }
    } else {
      return { label: 'Activo', color: 'bg-green-500/20 text-green-300' }
    }
  }

  const calculateDuration = () => {
    if (!contract) return 0
    const start = new Date(contract.startDate)
    const end = new Date(contract.endDate)
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    return months
  }

  if (contractLoading) {
    return <Loading size="lg" text="Cargando contrato..." />
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="h-16 w-16 text-white/20 mb-4" />
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

  const status = getContractStatus()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/contracts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <FileText className="h-8 w-8 mr-3 text-blue-600" />
              Contrato #{contract.id}
            </h1>
            <p className="text-white/60 mt-2">
              {apartment && building && `${building.name} - ${apartment.nomenclature}`}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Badge className={`${status.color} text-base px-4 py-2`}>
            {status.label}
          </Badge>
          <Button variant="outline" onClick={() => router.push(`/contracts/${contract.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Contract Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-white/60">Fecha de Inicio</p>
              <p className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(contract.startDate).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Fecha de Finalización</p>
              <p className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(contract.endDate).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Duración</p>
              <p className="font-medium">{calculateDuration()} meses</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Monto Inicial</p>
              <p className="font-medium text-xl flex items-center text-green-600">
                <DollarSign className="h-5 w-5 mr-1" />
                ${contract.initialAmount.toLocaleString('es-AR')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partes del Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-white/60">Departamento</p>
              {apartment && building ? (
                <Link href={`/apartments/${apartment.id}`}>
                  <p className="font-medium flex items-center hover:text-blue-600 cursor-pointer">
                    <Building2 className="h-4 w-4 mr-2" />
                    {building.name} - {apartment.nomenclature}
                  </p>
                </Link>
              ) : (
                <p className="font-medium">Cargando...</p>
              )}
            </div>
            <div>
              <p className="text-sm text-white/60">Inquilino</p>
              {tenant ? (
                <Link href={`/clients/${tenant.id}`}>
                  <p className="font-medium flex items-center hover:text-blue-600 cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    {tenant.nameOrBusiness}
                  </p>
                </Link>
              ) : (
                <p className="font-medium">Cargando...</p>
              )}
            </div>
            {tenant && (
              <>
                <div>
                  <p className="text-sm text-white/60">DNI/CUIT</p>
                  <p className="font-medium font-mono">{tenant.dniOrCuit}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Contacto</p>
                  <p className="font-medium">{tenant.contactPhone}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Rule */}
      {contract.updateRule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Regla de Actualización
            </CardTitle>
            <CardDescription>
              Configuración para actualización de montos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-white/60">Frecuencia</p>
                <p className="font-medium">{contract.updateRule.updateFrequency}</p>
              </div>
              {contract.updateRule.monthlyCoefficient && (
                <div>
                  <p className="text-sm text-white/60">Coeficiente Mensual</p>
                  <p className="font-medium">{contract.updateRule.monthlyCoefficient}</p>
                </div>
              )}
              {contract.updateRule.lateInterestPercent && (
                <div>
                  <p className="text-sm text-white/60">Interés por Mora</p>
                  <p className="font-medium">{contract.updateRule.lateInterestPercent}%</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/60">Fecha de Creación</p>
            <p className="font-medium">
              {new Date(contract.createdAt).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/60">Última Actualización</p>
            <p className="font-medium">
              {new Date(contract.updatedAt).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Trash2 className="h-5 w-5 mr-2" />
                Confirmar Eliminación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90">
                ¿Está seguro que desea eliminar el contrato #{contract.id}?
              </p>
              <p className="text-sm text-white/60">
                Esta acción no se puede deshacer. Se eliminarán también las reglas de actualización asociadas.
              </p>
              <div className="flex space-x-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
