'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, MapPin, Plus, Users, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { useBuilding, useBuildings } from '@/hooks/useBuildings'
import { useApartments } from '@/hooks/useApartments'
import { formatArea } from '@/lib/utils'
import { Apartment, ApartmentStatus, SaleStatus } from '@/types'

export default function BuildingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const buildingId = Number(params.id)

  const { building, loading: buildingLoading } = useBuilding(buildingId)
  const { apartments: allApartments, loading: apartmentsLoading } = useApartments()
  const { deleteBuilding } = useBuildings()
  
  const [openFloors, setOpenFloors] = useState<Set<number>>(new Set())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const loading = buildingLoading || apartmentsLoading
  
  // Filter apartments for this building
  const apartments = allApartments.filter(apt => Number(apt.buildingId) === buildingId)

  if (loading) {
    return <Loading size="lg" text="Cargando edificio..." />
  }

  if (!building) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Building2 className="h-16 w-16 text-white/20 mb-4" />
        <h2 className="text-xl font-semibold text-white/90 mb-2">Edificio no encontrado</h2>
        <p className="text-gray-500 mb-4">El edificio que buscas no existe</p>
        <Link href="/buildings">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Edificios
          </Button>
        </Link>
      </div>
    )
  }

  const toggleFloor = (floor: number) => {
    setOpenFloors(prev => {
      const newSet = new Set(prev)
      if (newSet.has(floor)) {
        newSet.delete(floor)
      } else {
        newSet.add(floor)
      }
      return newSet
    })
  }

  const handleDelete = async () => {
    if (apartments.length > 0) {
      alert('No se puede eliminar un edificio que tiene departamentos. Elimine primero todos los departamentos.')
      return
    }

    try {
      await deleteBuilding(buildingId)
      router.push('/buildings')
    } catch {
      alert('Error al eliminar el edificio. Por favor intente nuevamente.')
    }
  }

  // Separar cocheras de departamentos
  const parkingSpaces = apartments.filter(apt => apt.propertyType === 'cochera')
  const regularApartments = apartments.filter(apt => apt.propertyType !== 'cochera')

  // Agrupar departamentos por piso (solo los que tienen piso definido)
  const apartmentsByFloor = regularApartments.reduce((acc, apartment) => {
    if (apartment.floor !== null && apartment.floor !== undefined) {
      if (!acc[apartment.floor]) {
        acc[apartment.floor] = []
      }
      acc[apartment.floor].push(apartment)
    }
    return acc
  }, {} as Record<number, Apartment[]>)

  // Ordenar pisos de menor a mayor
  const sortedFloors = Object.keys(apartmentsByFloor)
    .map(Number)
    .sort((a, b) => a - b)

  const getStatusColor = (status: ApartmentStatus) => {
    switch (status) {
      case ApartmentStatus.AVAILABLE:
        return 'bg-green-500/20 text-green-300'
      case ApartmentStatus.RENTED:
        return 'bg-blue-500/20 text-blue-300'
      case ApartmentStatus.UNDER_RENOVATION:
        return 'bg-yellow-500/20 text-yellow-300'
      case ApartmentStatus.PERSONAL_USE:
        return 'bg-purple-500/20 text-purple-300'
      default:
        return 'bg-slate-800/50 text-white'
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
          <Link href="/buildings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Building2 className="h-8 w-8 mr-3 text-blue-600" />
              {building.name}
            </h1>
            <p className="text-white/60 mt-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {building.address}, {building.city}, {building.province}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => router.push(`/buildings/${building.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteConfirm(true)}
            disabled={apartments.length > 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
          <Link href={`/buildings/${building.id}/apartments/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Departamento
            </Button>
          </Link>
        </div>
      </div>

      {/* Building Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-white/60">Titular</p>
              <p className="font-medium">{building.owner}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Pisos</p>
              <p className="font-medium">{building.floors}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Área Total</p>
              <p className="font-medium">{formatArea(building.totalArea)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estadísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-white/60">Total Departamentos</p>
              <p className="font-medium">{apartments.length}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Disponibles</p>
              <p className="font-medium text-green-600">
                {apartments.filter(apt => apt.status === ApartmentStatus.AVAILABLE).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Alquilados</p>
              <p className="font-medium text-blue-600">
                {apartments.filter(apt => apt.status === ApartmentStatus.RENTED).length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuración de Pisos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {building.floorConfiguration && building.floorConfiguration.length > 0 ? (
                building.floorConfiguration.map((floor) => (
                  <div key={floor.floor} className="flex justify-between text-sm">
                    <span>Piso {floor.floor}:</span>
                    <span className="font-medium">{floor.apartmentsCount} dpto(s)</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay configuración de pisos</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Apartments List by Floor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Departamentos por Piso</CardTitle>
              <CardDescription>
                Departamentos organizados por piso del edificio
              </CardDescription>
            </div>
            <Link href={`/buildings/${building.id}/apartments/new`}>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Departamento
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {apartments.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No hay departamentos registrados
              </h3>
              <p className="text-white/60 mb-4">
                Comienza agregando departamentos a este edificio
              </p>
              <Link href={`/buildings/${building.id}/apartments/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Departamento
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedFloors.map((floor) => {
                const floorApartments = apartmentsByFloor[floor]
                const isOpen = openFloors.has(floor)
                const availableCount = floorApartments.filter(apt => apt.status === ApartmentStatus.AVAILABLE).length
                const rentedCount = floorApartments.filter(apt => apt.status === ApartmentStatus.RENTED).length
                
                // Detectar si es un piso de cocheras
                const isCocheraFloor = floor < 0 && floorApartments.some(apt => apt.propertyType === 'cochera')
                const floorLabel = isCocheraFloor ? 'Cocheras' : `Piso ${floor}`

                return (
                  <div key={floor} className="border rounded-lg overflow-hidden">
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleFloor(floor)}
                      className="w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-white/60" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-white/60" />
                          )}
                          <h3 className="text-lg font-semibold text-white">
                            {floorLabel}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="px-2 py-1 bg-slate-900/50 rounded-full border">
                            {floorApartments.length} unidad{floorApartments.length !== 1 ? 'es' : ''}
                          </span>
                          {availableCount > 0 && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                              {availableCount} disponible{availableCount !== 1 ? 's' : ''}
                            </span>
                          )}
                          {rentedCount > 0 && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                              {rentedCount} alquilado{rentedCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Accordion Content */}
                    {isOpen && (
                      <div className="p-4 bg-slate-900/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {floorApartments
                            .sort((a, b) => (a.apartmentLetter || '').localeCompare(b.apartmentLetter || ''))
                            .map((apartment) => (
                              <Card key={apartment.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">
                                      {apartment.nomenclature}
                                    </CardTitle>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apartment.status)}`}>
                                      {getStatusLabel(apartment.status)}
                                    </span>
                                  </div>
                                  <CardDescription className="text-xs">
                                    ID: {apartment.uniqueId}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <p className="text-white/60">Ambientes</p>
                                      <p className="font-medium">{apartment.rooms || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/60">Área</p>
                                      <p className="font-medium">{apartment.area ? formatArea(apartment.area) : 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/60">% Área</p>
                                      <p className="font-medium">{apartment.areaPercentage}%</p>
                                    </div>
                                    <div>
                                      <p className="text-white/60">% Ambientes</p>
                                      <p className="font-medium">{apartment.roomPercentage}%</p>
                                    </div>
                                  </div>

                                  {apartment.saleStatus === SaleStatus.FOR_SALE && (
                                    <div className="bg-green-50 border-none border-green-200 rounded-lg p-2">
                                      <p className="text-xs text-green-800 font-medium">En Venta</p>
                                    </div>
                                  )}

                                  <div className="flex space-x-2">
                                    <Link href={`/apartments/${apartment.id}`} className="flex-1">
                                      <Button variant="outline" size="sm" className="w-full">
                                        Ver Detalles
                                      </Button>
                                    </Link>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parking Spaces Section */}
      {parkingSpaces.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Cocheras
                </CardTitle>
                <CardDescription>
                  {parkingSpaces.length} cochera{parkingSpaces.length !== 1 ? 's' : ''} asociada{parkingSpaces.length !== 1 ? 's' : ''} a este edificio
                </CardDescription>
              </div>
              <Link href={`/apartments/new?buildingId=${buildingId}&type=cochera`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Cochera
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parkingSpaces
                .sort((a, b) => (a.nomenclature || '').localeCompare(b.nomenclature || ''))
                .map((parking) => {
                  const availableCount = parkingSpaces.filter(p => p.status === ApartmentStatus.AVAILABLE).length
                  const rentedCount = parkingSpaces.filter(p => p.status === ApartmentStatus.RENTED).length

                  return (
                    <Card key={parking.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              Cochera {parking.nomenclature}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {parking.uniqueId}
                            </CardDescription>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(parking.status)}`}>
                            {parking.status === ApartmentStatus.AVAILABLE && 'Disponible'}
                            {parking.status === ApartmentStatus.RENTED && 'Alquilada'}
                            {parking.status === ApartmentStatus.UNDER_RENOVATION && 'En Renovación'}
                            {parking.status === ApartmentStatus.PERSONAL_USE && 'Uso Personal'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {parking.area > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Área:</span>
                            <span className="font-medium">{formatArea(parking.area)}</span>
                          </div>
                        )}
                        {parking.saleStatus && parking.saleStatus === SaleStatus.FOR_SALE && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/60">Estado de Venta:</span>
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium">
                              En Venta
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Link href={`/apartments/${parking.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              Ver Detalles
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </CardContent>
        </Card>
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
                ¿Está seguro que desea eliminar el edificio <strong>{building.name}</strong>?
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
