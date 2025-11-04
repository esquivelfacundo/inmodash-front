
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Home, Plus, MapPin, ArrowRight, ChevronDown } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { GlassStatCard } from '@/components/ui/glass-stat-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { useApartments } from '@/hooks/useApartments'
import { useBuildings } from '@/hooks/useBuildings'
import { ApartmentStatus, SaleStatus } from '@/types'
import { formatArea, formatRooms } from '@/lib/utils'

type PropertyFilter = 'all' | 'departamentos' | 'casas' | 'cocheras' | 'locales'

export default function ApartmentsPage() {
  const router = useRouter()
  const { apartments, loading: apartmentsLoading } = useApartments()
  const { buildings, loading: buildingsLoading } = useBuildings()
  const [propertyFilter, setPropertyFilter] = useState<PropertyFilter>('all')
  const [expandedApartment, setExpandedApartment] = useState<number | null>(null)

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

  // Filter apartments by property type
  const filteredApartments = propertyFilter === 'all' 
    ? apartments
    : apartments.filter(apartment => {
        if (propertyFilter === 'departamentos') {
          return apartment.propertyType === 'departamento'
        } else if (propertyFilter === 'casas') {
          return apartment.propertyType === 'casa'
        } else if (propertyFilter === 'cocheras') {
          return apartment.propertyType === 'cochera'
        } else if (propertyFilter === 'locales') {
          return apartment.propertyType === 'local_comercial'
        }
        return true
      })

  const handleApartmentClick = (apartmentId: number) => {
    router.push(`/apartments/${apartmentId}`)
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassStatCard
          title="Total Propiedades"
          value={apartments.length}
          icon={Home}
        />
        <GlassStatCard
          title="Disponibles"
          value={apartments.filter(a => a.status === ApartmentStatus.AVAILABLE).length}
          icon={Home}
          iconClassName="bg-green-500/20"
        />
        <GlassStatCard
          title="Alquiladas"
          value={apartments.filter(a => a.status === ApartmentStatus.RENTED).length}
          icon={Home}
          iconClassName="bg-blue-500/20"
        />
        <GlassStatCard
          title="En Venta"
          value={apartments.filter(a => a.saleStatus === SaleStatus.FOR_SALE).length}
          icon={Home}
          iconClassName="bg-orange-500/20"
        />
      </div>


      {/* Apartments List */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2 text-white">
            <Home className="h-5 w-5" />
            Todas las Propiedades
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={propertyFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPropertyFilter('all')}
              className={propertyFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/5 hover:bg-white/10'}
            >
              Todos
            </Button>
            <Button
              variant={propertyFilter === 'departamentos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPropertyFilter('departamentos')}
              className={propertyFilter === 'departamentos' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/5 hover:bg-white/10'}
            >
              <Building2 className="h-3 w-3 mr-1" />
              Departamentos
            </Button>
            <Button
              variant={propertyFilter === 'casas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPropertyFilter('casas')}
              className={propertyFilter === 'casas' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/5 hover:bg-white/10'}
            >
              <Home className="h-3 w-3 mr-1" />
              Casas
            </Button>
            <Button
              variant={propertyFilter === 'cocheras' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPropertyFilter('cocheras')}
              className={propertyFilter === 'cocheras' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/5 hover:bg-white/10'}
            >
              <MapPin className="h-3 w-3 mr-1" />
              Cocheras
            </Button>
            <Button
              variant={propertyFilter === 'locales' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPropertyFilter('locales')}
              className={propertyFilter === 'locales' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/5 hover:bg-white/10'}
            >
              <Building2 className="h-3 w-3 mr-1" />
              Locales Comerciales
            </Button>
          </div>

          {filteredApartments.length === 0 ? (
            <div className="py-12 text-center">
              <Home className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white font-medium">No hay propiedades registradas</p>
              <p className="text-white/60 text-sm mt-1">Comienza creando tu primera propiedad</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApartments.map((apartment) => (
                <div
                  key={apartment.id}
                  className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
                >
                  {/* Desktop View */}
                  <div 
                    className="hidden md:flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => handleApartmentClick(apartment.id)}
                  >
                    {/* Icon and Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                        <Home className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">
                          {apartment.buildingId ? getBuildingName(apartment.buildingId) : apartment.fullAddress || 'Propiedad'} - {apartment.nomenclature}
                        </p>
                        <p className="text-sm text-white/60 truncate">
                          {apartment.buildingId ? `Piso ${apartment.floor}${apartment.apartmentLetter ? ` - ${apartment.apartmentLetter}` : ''}` : apartment.city}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      {/* Area */}
                      <div className="text-center">
                        <p className="text-xs text-white/60 mb-1">Área</p>
                        <div className="px-3 py-1 rounded-lg bg-white/10">
                          <span className="text-sm font-semibold text-white">{formatArea(apartment.area)}</span>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="text-center">
                        <p className="text-xs text-white/60 mb-1">Ambientes</p>
                        <div className="px-3 py-1 rounded-lg bg-white/10">
                          <span className="text-sm font-semibold text-white">{formatRooms(apartment.rooms)}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="text-center">
                        <p className="text-xs text-white/60 mb-1">Estado</p>
                        <div className={`px-3 py-1 rounded-lg ${getStatusColor(apartment.status)}`}>
                          <span className="text-sm font-semibold">{getStatusLabel(apartment.status)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>

                  {/* Mobile View - Accordion */}
                  <div className="md:hidden">
                    {/* Header - Always Visible */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => setExpandedApartment(expandedApartment === apartment.id ? null : apartment.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                          <Home className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{apartment.nomenclature}</p>
                          <p className="text-xs text-white/60 truncate">
                            {apartment.buildingId ? getBuildingName(apartment.buildingId) : apartment.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(apartment.status)}`}>
                          {getStatusLabel(apartment.status)}
                        </div>
                        <ChevronDown 
                          className={`h-5 w-5 text-white/60 transition-transform ${
                            expandedApartment === apartment.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedApartment === apartment.id && (
                      <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                        {/* Location */}
                        <div>
                          <p className="text-xs text-white/60 mb-1">Ubicación</p>
                          {apartment.buildingId ? (
                            <div>
                              <p className="text-sm font-medium text-white">{getBuildingName(apartment.buildingId)}</p>
                              <p className="text-xs text-white/60">Piso {apartment.floor}{apartment.apartmentLetter ? ` - ${apartment.apartmentLetter}` : ''}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-white">{apartment.fullAddress}</p>
                              <p className="text-xs text-white/60">{apartment.city}, {apartment.province}</p>
                            </div>
                          )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Área</p>
                            <p className="text-lg font-semibold text-white">{formatArea(apartment.area)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Ambientes</p>
                            <p className="text-lg font-semibold text-white">{formatRooms(apartment.rooms)}</p>
                          </div>
                        </div>

                        {/* Owner */}
                        {apartment.owner && (
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Propietario</p>
                            <p className="text-sm text-white">{apartment.owner.name}</p>
                          </div>
                        )}

                        {/* View Button */}
                        <Button
                          className="w-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                          onClick={() => handleApartmentClick(apartment.id)}
                        >
                          Ver Detalles
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
