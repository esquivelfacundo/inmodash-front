'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, Home, MapPin, Edit, FileText, TrendingUp, User, UserPlus, Calendar, Trash2, Plus, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { useApartment, useApartments } from '@/hooks/useApartments'
import { useContracts } from '@/hooks/useContracts'
import { useTenants } from '@/hooks/useTenants'
import { ApartmentStatus, SaleStatus } from '@/types'
import { formatArea, formatRooms } from '@/lib/utils'
import { PropertySpecifications } from '@/components/property/PropertySpecifications'
import { getPropertyLabel, getStatusSectionTitle, getLocationSectionTitle } from '@/lib/property-labels'

export default function ApartmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const apartmentId = Number(params.id)

  const { apartment, loading: apartmentLoading } = useApartment(apartmentId)
  const { contracts, loading: contractsLoading } = useContracts()
  const { tenants, loading: tenantsLoading } = useTenants()
  const { deleteApartment } = useApartments()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const loading = apartmentLoading || contractsLoading || tenantsLoading

  const propertyLabel = apartment ? getPropertyLabel(apartment.propertyType) : 'Propiedad'

  // Filter contracts for this apartment
  const apartmentContracts = useMemo(() => {
    return contracts.filter(contract => contract.apartmentId === apartmentId)
  }, [contracts, apartmentId])

  // Separate active and past contracts
  const { activeContracts, pastContracts } = useMemo(() => {
    const now = new Date()
    const active = apartmentContracts.filter(contract => 
      new Date(contract.startDate) <= now && new Date(contract.endDate) >= now
    )
    const past = apartmentContracts.filter(contract => 
      new Date(contract.endDate) < now
    )
    return { activeContracts: active, pastContracts: past }
  }, [apartmentContracts])

  // Get tenant name
  const getTenantName = (tenantId: number) => {
    const tenant = tenants.find(t => t.id === tenantId)
    return tenant?.nameOrBusiness || 'Cliente desconocido'
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <Loading size="lg" text={`Cargando ${propertyLabel.toLowerCase()}...`} />
  }

  if (!apartment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Home className="h-16 w-16 text-white/20 mb-4" />
        <h2 className="text-xl font-semibold text-white/90 mb-2">Propiedad no encontrada</h2>
        <p className="text-gray-500 mb-4">La propiedad que buscas no existe</p>
        <Link href="/apartments">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Unidades
          </Button>
        </Link>
      </div>
    )
  }
  

  const getStatusColor = (status: ApartmentStatus) => {
    switch (status) {
      case ApartmentStatus.AVAILABLE:
        return 'bg-green-500/20 text-green-300 border-green-200'
      case ApartmentStatus.RENTED:
        return 'bg-blue-500/20 text-blue-300 border-blue-200'
      case ApartmentStatus.UNDER_RENOVATION:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-200'
      case ApartmentStatus.PERSONAL_USE:
        return 'bg-purple-500/20 text-purple-300 border-purple-200'
      default:
        return 'bg-slate-800/50 text-white -200'
    }
  }

  const handleDelete = async () => {
    try {
      await deleteApartment(apartmentId)
      if (apartment.buildingId) {
        router.push(`/buildings/${apartment.buildingId}`)
      } else {
        router.push('/apartments')
      }
    } catch {
      alert(`Error al eliminar ${propertyLabel.toLowerCase()}. Por favor intente nuevamente.`)
    }
  }

  const getStatusLabel = (status: ApartmentStatus) => {
    switch (status) {
      case ApartmentStatus.AVAILABLE:
        return 'Disponible'
      case ApartmentStatus.RENTED:
        return 'Alquilado'
      case ApartmentStatus.UNDER_RENOVATION:
        return 'En Refacción'
      case ApartmentStatus.PERSONAL_USE:
        return 'Uso Propio'
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {apartment.buildingId ? (
            <Link href={`/buildings/${apartment.buildingId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Edificio
              </Button>
            </Link>
          ) : (
            <Link href="/apartments">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Unidades
              </Button>
            </Link>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Home className="h-8 w-8 mr-3 text-blue-600" />
              {propertyLabel} {apartment.nomenclature}
            </h1>
            <p className="text-white/60 mt-2">
              ID Único: <span className="font-mono font-medium">{apartment.uniqueId}</span>
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => router.push(`/apartments/${apartment.id}/edit`)}>
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

      {/* Status and Location Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {getStatusSectionTitle(apartment.propertyType)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(apartment.status)}`}>
                {getStatusLabel(apartment.status)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-white/60">Tipo</p>
              <p className="font-medium text-lg">{propertyLabel}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Comercialización</p>
              <div className="flex items-center mt-1">
                {apartment.saleStatus === SaleStatus.FOR_SALE ? (
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                    En Venta
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-slate-800/50 text-white rounded-full text-sm font-medium">
                    No está en venta
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-white/60">Nomenclatura</p>
              <p className="font-medium text-lg">{apartment.nomenclature}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {apartment.buildingId ? <Building2 className="h-5 w-5 mr-2" /> : <MapPin className="h-5 w-5 mr-2" />}
              {getLocationSectionTitle(apartment.propertyType, !!apartment.buildingId)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {apartment.buildingId ? (
              <>
                <div>
                  <p className="text-sm text-white/60">Nombre</p>
                  <p className="font-medium">{apartment.building?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Dirección</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {apartment.building?.address}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/60">Ciudad</p>
                    <p className="font-medium">{apartment.building?.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Provincia</p>
                    <p className="font-medium">{apartment.building?.province}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-white/60">Dirección</p>
                  <p className="font-medium">{apartment.fullAddress}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/60">Ciudad</p>
                    <p className="font-medium">{apartment.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Provincia</p>
                    <p className="font-medium">{apartment.province}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Apartment Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Características Físicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-white/60">Piso</p>
              <p className="font-medium text-xl">{apartment.floor}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Área</p>
              <p className="font-medium text-xl">{formatArea(apartment.area)}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Ambientes</p>
              <p className="font-medium text-xl">{formatRooms(apartment.rooms)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Porcentajes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-white/60">% del Área Total</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(apartment.areaPercentage, 100)}%` }}
                  ></div>
                </div>
                <span className="font-medium">{apartment.areaPercentage}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-white/60">% de Ambientes</p>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(apartment.roomPercentage, 100)}%` }}
                  ></div>
                </div>
                <span className="font-medium">{apartment.roomPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-4">No hay planos cargados</p>
              <Button variant="outline" size="sm">
                Subir Planos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Contracts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Contrato Activo ({activeContracts.length})
              </CardTitle>
              <CardDescription>
                Contrato de alquiler vigente en este momento
              </CardDescription>
            </div>
            <Link href="/contracts/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Crear Contrato
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {activeContracts.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <FileText className="h-12 w-12 mx-auto mb-3 text-white/20" />
              <p className="mb-4">No hay contratos activos en este momento</p>
              <Link href="/contracts/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nuevo Contrato
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeContracts.map((contract) => (
                <Card key={contract.id} className="bg-green-500/5 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
                              Activo
                            </Badge>
                            <p className="text-sm text-white/60">
                              Contrato #{contract.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-white/60" />
                            <p className="font-medium">{getTenantName(contract.tenantId)}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/contracts/${contract.id}`)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                        <div>
                          <p className="text-xs text-white/60 mb-1">Fecha de Inicio</p>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-white/60" />
                            {formatDate(contract.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60 mb-1">Fecha de Finalización</p>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-white/60" />
                            {formatDate(contract.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60 mb-1">Monto Inicial</p>
                          <p className="text-sm font-medium">
                            ${contract.initialAmount.toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-600" />
            Historial de Alquileres ({pastContracts.length})
          </CardTitle>
          <CardDescription>
            Contratos de alquiler finalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pastContracts.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Clock className="h-12 w-12 mx-auto mb-3 text-white/20" />
              <p>No hay historial de alquileres para esta propiedad</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastContracts.map((contract) => (
                <Card key={contract.id} className="bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/30">
                              Finalizado
                            </Badge>
                            <p className="text-sm text-white/60">
                              Contrato #{contract.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-white/60" />
                            <p className="font-medium">{getTenantName(contract.tenantId)}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/contracts/${contract.id}`)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                        <div>
                          <p className="text-xs text-white/60 mb-1">Fecha de Inicio</p>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-white/60" />
                            {formatDate(contract.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60 mb-1">Fecha de Finalización</p>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-white/60" />
                            {formatDate(contract.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60 mb-1">Monto Inicial</p>
                          <p className="text-sm font-medium">
                            ${contract.initialAmount.toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-white/60 mb-2">Fecha de Creación</p>
              <p className="font-medium">
                {new Date(apartment.createdAt).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-2">Última Actualización</p>
              <p className="font-medium">
                {new Date(apartment.updatedAt).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Especificaciones */}
      {apartment.specifications && (
        <PropertySpecifications
          propertyType={apartment.propertyType}
          value={JSON.parse(apartment.specifications)}
          readOnly
        />
      )}

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
                ¿Está seguro que desea eliminar {propertyLabel.toLowerCase()} <strong>{apartment.nomenclature}</strong>?
              </p>
              <p className="text-sm text-white/60">
                Esta acción no se puede deshacer.
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
