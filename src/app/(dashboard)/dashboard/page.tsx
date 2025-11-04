'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Home, Plus, TrendingUp, FileText, MapPin } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { GlassStatCard } from '@/components/ui/glass-stat-card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { useDashboard } from '@/hooks/useDashboard'
import { useBuildings } from '@/hooks/useBuildings'
import { useApartments } from '@/hooks/useApartments'
import { useContracts } from '@/hooks/useContracts'
import { ApartmentStatus } from '@/types'

type PropertyFilter = 'all' | 'departamentos' | 'casas' | 'cocheras' | 'locales'

export default function Dashboard() {
  const router = useRouter()
  const { stats, loading: statsLoading } = useDashboard()
  const { buildings, loading: buildingsLoading } = useBuildings()
  const { apartments, loading: apartmentsLoading } = useApartments()
  const { contracts, loading: contractsLoading } = useContracts()
  const [propertyFilter, setPropertyFilter] = useState<PropertyFilter>('all')

  const loading = statsLoading || buildingsLoading || apartmentsLoading || contractsLoading

  // Calculate stats
  const totalUnits = apartments.length
  const availableUnits = apartments.filter(apt => apt.status === ApartmentStatus.AVAILABLE).length
  const rentedUnits = apartments.filter(apt => apt.status === ApartmentStatus.RENTED).length
  const activeContracts = contracts.filter(c => new Date(c.endDate) >= new Date()).length

  // Get contracts expiring in less than 30 days
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  // Group apartments by building
  const buildingsWithStats = buildings.map(building => {
    const buildingApartments = apartments.filter(apt => apt.buildingId === building.id)
    const available = buildingApartments.filter(apt => apt.status === ApartmentStatus.AVAILABLE).length
    const rented = buildingApartments.filter(apt => apt.status === ApartmentStatus.RENTED).length
    
    // Get contracts for this building's apartments
    const buildingContracts = contracts.filter(contract => 
      buildingApartments.some(apt => apt.id === contract.apartmentId)
    )
    
    // Count contracts expiring soon
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

  // Filter buildings based on property type
  const filteredBuildings = propertyFilter === 'all' 
    ? buildingsWithStats
    : buildingsWithStats.filter(building => {
        const buildingApartments = apartments.filter(apt => apt.buildingId === building.id)
        if (propertyFilter === 'departamentos') {
          return buildingApartments.some(apt => apt.propertyType === 'departamento')
        } else if (propertyFilter === 'casas') {
          return buildingApartments.some(apt => apt.propertyType === 'casa')
        } else if (propertyFilter === 'cocheras') {
          return buildingApartments.some(apt => apt.propertyType === 'cochera')
        } else if (propertyFilter === 'locales') {
          return buildingApartments.some(apt => apt.propertyType === 'local_comercial')
        }
        return true
      })

  const handleBuildingClick = (buildingId: number) => {
    router.push(`/buildings/${buildingId}`)
  }

  if (loading) {
    return <Loading size="lg" text="Cargando dashboard..." />
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/60 text-lg">
            Resumen general de tu cartera inmobiliaria
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/clients">
            <Button variant="outline" className="gap-2 bg-white/5 text-white hover:bg-white/10 hover:shadow-lg transition-all">
              <Users className="h-4 w-4" />
              Clientes
            </Button>
          </Link>
          <Link href="/buildings/new">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/20">
              <Plus className="h-4 w-4" />
              Nuevo Edificio
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassStatCard
          title="Total Unidades"
          value={totalUnits}
          icon={Home}
        />
        <GlassStatCard
          title="Unidades Disponibles"
          value={availableUnits}
          icon={Plus}
        />
        <GlassStatCard
          title="Unidades Alquiladas"
          value={rentedUnits}
          icon={TrendingUp}
        />
        <GlassStatCard
          title="Contratos Activos"
          value={activeContracts}
          icon={FileText}
        />
      </div>

      {/* Buildings Table */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <GlassCardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5" />
                Edificios y Propiedades
              </GlassCardTitle>
              <GlassCardDescription className="text-white/60">
                Vista general de todas tus propiedades
              </GlassCardDescription>
            </div>
            <Link href="/buildings/new">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="h-4 w-4" />
                Nuevo Edificio
              </Button>
            </Link>
          </div>
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Nombre</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Dirección</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-white/80">Unidades</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-white/80">Disponibles</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-white/80">Alquiladas</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-white/80">Próximas a liberarse</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuildings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-white/60">
                      No hay edificios registrados
                    </td>
                  </tr>
                ) : (
                  filteredBuildings.map((building) => (
                    <tr
                      key={building.id}
                      onClick={() => handleBuildingClick(building.id)}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/20">
                            <Building2 className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="font-medium text-white">{building.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white/70">
                        {building.address}, {building.city}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className="bg-white/5">
                          {building.totalUnits}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className="bg-green-500/20 text-green-300">
                          {building.available}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className="bg-blue-500/20 text-blue-300">
                          {building.rented}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {building.expiringSoon > 0 ? (
                          <Badge className="bg-orange-500/20 text-orange-300">
                            {building.expiringSoon}
                          </Badge>
                        ) : (
                          <span className="text-white/40">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
