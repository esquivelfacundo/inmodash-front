'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Plus, MapPin, Users, Edit, ArrowRight, ChevronDown, Home } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { useBuildings } from '@/hooks/useBuildings'
import { useApartments } from '@/hooks/useApartments'
import { useContracts } from '@/hooks/useContracts'
import { ApartmentStatus } from '@/types'
import { formatArea } from '@/lib/utils'

export default function BuildingsPage() {
  const router = useRouter()
  const { buildings, loading } = useBuildings()
  const { apartments } = useApartments()
  const { contracts } = useContracts()
  const [expandedBuilding, setExpandedBuilding] = useState<number | null>(null)

  // Calculate stats for each building
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  const buildingsWithStats = buildings.map(building => {
    const buildingApartments = apartments.filter(apt => apt.buildingId === building.id)
    const available = buildingApartments.filter(apt => apt.status === ApartmentStatus.AVAILABLE).length
    const rented = buildingApartments.filter(apt => apt.status === ApartmentStatus.RENTED).length
    
    const buildingContracts = contracts.filter(contract => 
      buildingApartments.some(apt => apt.id === contract.apartmentId)
    )
    
    const expiringSoon = buildingContracts.filter(contract => {
      const endDate = new Date(contract.endDate)
      return endDate >= today && endDate <= thirtyDaysFromNow
    }).length

    return {
      ...building,
      totalUnits: buildingApartments.length,
      available,
      rented,
      expiringSoon
    }
  })

  const handleBuildingClick = (buildingId: number) => {
    router.push(`/buildings/${buildingId}`)
  }

  if (loading) {
    return <Loading size="lg" text="Cargando edificios..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Edificios</h1>
          <p className="text-white/60 mt-2">
            Gestiona todos tus edificios y propiedades
          </p>
        </div>
        <Link href="/buildings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Edificio
          </Button>
        </Link>
      </div>

      {/* Buildings List */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2 text-white">
            <Building2 className="h-5 w-5" />
            Todos los Edificios
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {buildingsWithStats.length === 0 ? (
            <div className="py-12 text-center">
              <Building2 className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white font-medium">No hay edificios registrados</p>
              <p className="text-white/60 text-sm mt-1 mb-6">Comienza creando tu primer edificio</p>
              <Link href="/buildings/new">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Edificio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {buildingsWithStats.map((building) => (
                <div
                  key={building.id}
                  className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
                >
                  {/* Desktop View */}
                  <div 
                    className="hidden md:flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => handleBuildingClick(building.id)}
                  >
                    {/* Icon and Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                        <Building2 className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{building.name}</p>
                        <p className="text-sm text-white/60 truncate">{building.address}, {building.city}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      {/* Total Units */}
                      <div className="text-center">
                        <p className="text-xs text-white/60 mb-1">Unidades</p>
                        <div className="px-3 py-1 rounded-lg bg-white/10">
                          <span className="text-sm font-semibold text-white">{building.totalUnits}</span>
                        </div>
                      </div>

                      {/* Available */}
                      <div className="text-center">
                        <p className="text-xs text-white/60 mb-1">Disponibles</p>
                        <div className="px-3 py-1 rounded-lg bg-green-500/20">
                          <span className="text-sm font-semibold text-green-300">{building.available}</span>
                        </div>
                      </div>

                      {/* Rented */}
                      <div className="text-center">
                        <p className="text-xs text-white/60 mb-1">Alquiladas</p>
                        <div className="px-3 py-1 rounded-lg bg-blue-500/20">
                          <span className="text-sm font-semibold text-blue-300">{building.rented}</span>
                        </div>
                      </div>

                      {/* Expiring Soon */}
                      <div className="text-center">
                        <p className="text-xs text-white/60 mb-1">Próximas</p>
                        <div className="px-3 py-1 rounded-lg bg-orange-500/20">
                          <span className="text-sm font-semibold text-orange-300">
                            {building.expiringSoon > 0 ? building.expiringSoon : '-'}
                          </span>
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
                      onClick={() => setExpandedBuilding(expandedBuilding === building.id ? null : building.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                          <Building2 className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{building.name}</p>
                          <p className="text-xs text-white/60 truncate">{building.address}</p>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-white/60 transition-transform flex-shrink-0 ${
                          expandedBuilding === building.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Expanded Content */}
                    {expandedBuilding === building.id && (
                      <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                        {/* Address */}
                        <div>
                          <p className="text-xs text-white/60 mb-1">Dirección Completa</p>
                          <p className="text-sm text-white">{building.address}, {building.city}, {building.province}</p>
                        </div>

                        {/* Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Pisos</p>
                            <p className="text-lg font-semibold text-white">{building.floors}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Área Total</p>
                            <p className="text-lg font-semibold text-white">{formatArea(building.totalArea)}</p>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Unidades</p>
                            <p className="text-lg font-semibold text-white">{building.totalUnits}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-500/10">
                            <p className="text-xs text-green-400/80 mb-1">Disponibles</p>
                            <p className="text-lg font-semibold text-green-300">{building.available}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-500/10">
                            <p className="text-xs text-blue-400/80 mb-1">Alquiladas</p>
                            <p className="text-lg font-semibold text-blue-300">{building.rented}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-orange-500/10">
                            <p className="text-xs text-orange-400/80 mb-1">Próximas</p>
                            <p className="text-lg font-semibold text-orange-300">
                              {building.expiringSoon > 0 ? building.expiringSoon : '-'}
                            </p>
                          </div>
                        </div>

                        {/* Owner */}
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-white/60 mb-1">Titular</p>
                          <p className="text-sm text-white">{building.owner}</p>
                        </div>

                        {/* View Button */}
                        <Button
                          className="w-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                          onClick={() => handleBuildingClick(building.id)}
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
