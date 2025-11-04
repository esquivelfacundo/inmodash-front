'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Home, Plus, Users, Edit, MapPin, UserCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { useApartments } from '@/hooks/useApartments'
import { useBuildings } from '@/hooks/useBuildings'
import { ApartmentStatus, SaleStatus } from '@/types'
import { formatArea, formatRooms } from '@/lib/utils'

export default function ApartmentsPage() {
  const router = useRouter()
  const { apartments, loading: apartmentsLoading } = useApartments()
  const { buildings, loading: buildingsLoading } = useBuildings()
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null)

  const loading = apartmentsLoading || buildingsLoading

  const getBuildingName = (buildingId: string | number) => {
    const building = buildings.find(b => String(b.id) === String(buildingId))
    return building?.name || 'Edificio desconocido'
  }

  const getBuildingLocation = (buildingId: string | number) => {
    const building = buildings.find(b => String(b.id) === String(buildingId))
    if (!building) return null
    return {
      address: building.address,
      city: building.city,
      province: building.province
    }
  }

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

  // Filtrar departamentos por edificio seleccionado
  const filteredApartments = selectedBuildingId === null
    ? apartments
    : apartments.filter(apt => 
        selectedBuildingId === 0 
          ? !apt.buildingId // Propiedades independientes
          : apt.buildingId === selectedBuildingId
      )

  if (loading) {
    return <Loading size="lg" text="Cargando departamentos..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Propiedades</h1>
          <p className="text-white/60 mt-2">
            Gestiona todas las propiedades (en edificios e independientes)
          </p>
        </div>
        <Link href="/apartments/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apartments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apartments.filter(a => a.status === ApartmentStatus.AVAILABLE).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alquilados</CardTitle>
            <Home className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apartments.filter(a => a.status === ApartmentStatus.RENTED).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Venta</CardTitle>
            <Home className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {apartments.filter(a => a.saleStatus === SaleStatus.FOR_SALE).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Building Filter Pills */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white/80">Filtrar por edificio</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedBuildingId === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedBuildingId(null)}
            className="rounded-full"
          >
            Todos ({apartments.length})
          </Button>
          
          {buildings.length > 0 && buildings.map((building) => {
            const count = apartments.filter(apt => apt.buildingId === building.id).length
            return (
              <Button
                key={building.id}
                variant={selectedBuildingId === building.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBuildingId(building.id)}
                className="rounded-full"
              >
                <Building2 className="h-3 w-3 mr-1" />
                {building.name} ({count})
              </Button>
            )
          })}
          
          {apartments.some(apt => !apt.buildingId) && (
            <Button
              variant={selectedBuildingId === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBuildingId(0)}
              className="rounded-full"
            >
              <Home className="h-3 w-3 mr-1" />
              Independientes ({apartments.filter(apt => !apt.buildingId).length})
            </Button>
          )}
        </div>
      </div>

      {/* Apartments Grid */}
      {filteredApartments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Home className="h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {apartments.length === 0 
                ? 'No hay departamentos registrados'
                : 'No hay departamentos en este edificio'
              }
            </h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              {apartments.length === 0 
                ? 'Los departamentos se crean desde los edificios.'
                : 'Selecciona otro edificio para ver sus departamentos.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApartments.map((apartment) => (
            <Card key={apartment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-blue-600" />
                      <span>{apartment.nomenclature}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-1 mt-1">
                      {apartment.buildingId ? (
                        <>
                          <Building2 className="h-4 w-4" />
                          <span>{getBuildingName(apartment.buildingId)}</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{apartment.fullAddress || 'Propiedad independiente'}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(apartment.status)}>
                    {getStatusLabel(apartment.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {apartment.buildingId && (
                    <>
                      <div>
                        <p className="text-white/60">Piso</p>
                        <p className="font-medium">{apartment.floor}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Letra</p>
                        <p className="font-medium">{apartment.apartmentLetter}</p>
                      </div>
                      {(() => {
                        const location = getBuildingLocation(apartment.buildingId)
                        return location ? (
                          <div className="col-span-2">
                            <p className="text-white/60">Ubicación</p>
                            <p className="font-medium text-xs">{location.address}</p>
                            <p className="font-medium text-xs text-white/70">{location.city}, {location.province}</p>
                          </div>
                        ) : null
                      })()}
                    </>
                  )}
                  {!apartment.buildingId && apartment.city && (
                    <div className="col-span-2">
                      <p className="text-white/60">Ubicación</p>
                      <p className="font-medium text-xs">{apartment.fullAddress}</p>
                      <p className="font-medium text-xs text-white/70">{apartment.city}, {apartment.province}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-white/60">Área</p>
                    <p className="font-medium">{formatArea(apartment.area)}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Ambientes</p>
                    <p className="font-medium">{formatRooms(apartment.rooms)}</p>
                  </div>
                </div>

                {apartment.owner && (
                  <div className="border-t pt-3">
                    <div className="flex items-center space-x-2 text-sm text-white/60">
                      <UserCircle className="h-4 w-4" />
                      <span className="font-medium">{apartment.owner.name}</span>
                    </div>
                  </div>
                )}

                {apartment.saleStatus === SaleStatus.FOR_SALE && (
                  <div className="bg-orange-50 border-none border-orange-200 rounded-lg p-2">
                    <p className="text-xs text-orange-800 font-medium">En Venta</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => router.push(`/apartments/${apartment.id}`)}
                  >
                    Ver Detalles
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/apartments/${apartment.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
