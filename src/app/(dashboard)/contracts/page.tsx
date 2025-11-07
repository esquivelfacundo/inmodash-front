'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Calendar, User, Edit, Trash2, DollarSign, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { useContracts } from '@/hooks/useContracts'

export default function ContractsPage() {
  const router = useRouter()
  const { contracts, loading, deleteContract } = useContracts()
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const isContractActive = (contract: any) => {
    const now = new Date()
    const endDate = new Date(contract.endDate)
    return endDate >= now
  }

  const getContractStatus = (contract: any) => {
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

  const getApartmentInfo = (contract: any) => {
    if (contract.apartment) {
      return `${contract.apartment.nomenclature} - ${contract.apartment.building?.name || 'Edificio'}`
    }
    return `Departamento #${contract.apartmentId}`
  }

  const getTenantName = (contract: any) => {
    if (contract.tenant) {
      return contract.tenant.nameOrBusiness
    }
    return `Cliente #${contract.tenantId}`
  }

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteContract(deleteConfirm)
        setDeleteConfirm(null)
      } catch {
        alert('Error al eliminar el contrato. Por favor intente nuevamente.')
      }
    }
  }

  const activeContracts = contracts.filter(isContractActive)
  const expiredContracts = contracts.filter(c => !isContractActive(c))
  const expiringSoon = contracts.filter(c => {
    const now = new Date()
    const endDate = new Date(c.endDate)
    const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilEnd > 0 && daysUntilEnd <= 30
  })

  if (loading) {
    return <Loading size="lg" text="Cargando contratos..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Contratos</h1>
          <p className="text-white/60 mt-2">
            Gestiona todos los contratos de alquiler
          </p>
        </div>
        <Link href="/contracts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Contrato
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contratos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringSoon.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredContracts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      {contracts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No hay contratos registrados
            </h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              Los contratos se crean desde los departamentos cuando asignas un inquilino.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => {
            const status = getContractStatus(contract)
            return (
              <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2 text-base">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>Contrato #{contract.id}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getApartmentInfo(contract)}
                      </CardDescription>
                    </div>
                    <Badge className={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-white/60">
                      <User className="h-4 w-4 mr-2" />
                      <span>{getTenantName(contract)}</span>
                    </div>
                    <div className="flex items-center text-white/60">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(contract.startDate).toLocaleDateString('es-AR')} - {new Date(contract.endDate).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                    <div className="flex items-center text-white/60">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${contract.initialAmount.toLocaleString('es-AR')}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => router.push(`/contracts/${contract.id}`)}
                    >
                      Ver Detalle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/contracts/${contract.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setDeleteConfirm(contract.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
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
                ¿Está seguro que desea eliminar este contrato?
              </p>
              <p className="text-sm text-white/60">
                Esta acción no se puede deshacer. Se eliminarán también las reglas de actualización asociadas.
              </p>
              <div className="flex space-x-3 justify-end">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
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
