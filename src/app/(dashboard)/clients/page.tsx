'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Users, FileText, Calendar, TrendingUp, Mail, Phone, Edit, Trash2, ArrowRight, ChevronDown, User, Search, Building2, Home } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { GlassStatCard } from '@/components/ui/glass-stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { Input } from '@/components/ui/input'
import { useTenants } from '@/hooks/useTenants'
import { useContracts } from '@/hooks/useContracts'
import { useBuildings } from '@/hooks/useBuildings'
import { useApartments } from '@/hooks/useApartments'

export default function ClientsPage() {
  const router = useRouter()
  const { tenants, loading: tenantsLoading, deleteTenant } = useTenants()
  const { contracts, loading: contractsLoading } = useContracts()
  const { buildings, loading: buildingsLoading } = useBuildings()
  const { apartments, loading: apartmentsLoading } = useApartments()
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [expandedClient, setExpandedClient] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [buildingFilter, setBuildingFilter] = useState<number | 'all'>('all')

  const loading = tenantsLoading || contractsLoading || buildingsLoading || apartmentsLoading

  // Helper function to get active contract for a tenant
  const getActiveContract = (tenantId: number) => {
    const now = new Date()
    return contracts.find(contract => 
      contract.tenantId === tenantId && 
      new Date(contract.startDate) <= now && 
      new Date(contract.endDate) >= now
    )
  }

  // Helper function to check if tenant is active
  const isTenantActive = (tenantId: number) => {
    return !!getActiveContract(tenantId)
  }

  // Helper function to get apartment info
  const getApartmentInfo = (tenantId: number) => {
    const activeContract = getActiveContract(tenantId)
    if (!activeContract) return null
    
    const apartment = apartments.find(apt => apt.id === activeContract.apartmentId)
    if (!apartment) return null

    const building = apartment.buildingId 
      ? buildings.find(b => b.id === apartment.buildingId)
      : null

    return {
      apartment,
      building,
      buildingName: building?.name || '-',
      unitName: apartment.nomenclature || '-'
    }
  }

  // Enhanced tenants with contract info
  const tenantsWithInfo = useMemo(() => {
    return tenants.map(tenant => ({
      ...tenant,
      isActive: isTenantActive(tenant.id),
      apartmentInfo: getApartmentInfo(tenant.id)
    }))
  }, [tenants, contracts, apartments, buildings])

  // Filter tenants
  const filteredTenants = useMemo(() => {
    return tenantsWithInfo.filter(tenant => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        tenant.nameOrBusiness.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.dniOrCuit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.contactPhone.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && tenant.isActive) ||
        (statusFilter === 'inactive' && !tenant.isActive)

      // Building filter
      const matchesBuilding = buildingFilter === 'all' ||
        (tenant.apartmentInfo?.building?.id === buildingFilter)

      return matchesSearch && matchesStatus && matchesBuilding
    })
  }, [tenantsWithInfo, searchTerm, statusFilter, buildingFilter])

  const activeTenants = tenantsWithInfo.filter(t => t.isActive).length
  const inactiveTenants = tenantsWithInfo.filter(t => !t.isActive).length

  const stats = {
    totalTenants: tenants.length,
    activeContracts: activeTenants,
    expiringSoon: 0,
    totalGuarantors: 0,
  }

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteTenant(deleteConfirm)
        setDeleteConfirm(null)
      } catch {
        alert('Error al eliminar el cliente. Por favor intente nuevamente.')
      }
    }
  }

  const handleClientClick = (clientId: number) => {
    router.push(`/clients/${clientId}`)
  }

  if (loading) {
    return <Loading size="lg" text="Cargando clientes..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-white/60 mt-2">
            Gestiona tus clientes e inquilinos
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassStatCard
          title="Total Clientes"
          value={stats.totalTenants}
          icon={Users}
        />
        <GlassStatCard
          title="Clientes Activos"
          value={activeTenants}
          icon={FileText}
          iconClassName="bg-green-500/20"
        />
        <GlassStatCard
          title="Clientes Inactivos"
          value={inactiveTenants}
          icon={Calendar}
          iconClassName="bg-red-500/20"
        />
        <GlassStatCard
          title="Garantes"
          value={stats.totalGuarantors}
          icon={TrendingUp}
          iconClassName="bg-purple-500/20"
        />
      </div>

      {/* Clients List */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Todos los Clientes
          </GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Buscar por nombre, DNI/CUIT, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/5 hover:bg-white/10'}
                >
                  Todos
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                  className={statusFilter === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-white/5 hover:bg-white/10'}
                >
                  Activos
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('inactive')}
                  className={statusFilter === 'inactive' ? 'bg-red-600 hover:bg-red-700' : 'bg-white/5 hover:bg-white/10'}
                >
                  Inactivos
                </Button>
              </div>

              {/* Building Filter */}
              <select
                value={buildingFilter}
                onChange={(e) => setBuildingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-2 rounded-lg bg-white/5 text-white text-sm border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-slate-900">Todos los edificios</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id} className="bg-slate-900">
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <p className="text-sm text-white/60">
              Mostrando {filteredTenants.length} de {tenants.length} clientes
            </p>
          </div>

          {tenants.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white font-medium">No hay clientes registrados</p>
              <p className="text-white/60 text-sm mt-1">
                Los clientes se crean desde los departamentos cuando asignas un inquilino.
              </p>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white font-medium">No se encontraron clientes</p>
              <p className="text-white/60 text-sm mt-1">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
                >
                  {/* Desktop View */}
                  <div 
                    className="hidden md:flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => handleClientClick(tenant.id)}
                  >
                    {/* Icon and Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                        <User className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">
                          {tenant.nameOrBusiness}
                        </p>
                        <p className="text-sm text-white/60 truncate">
                          DNI/CUIT: {tenant.dniOrCuit}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                      {/* Building */}
                      <div className="text-center min-w-[120px]">
                        <p className="text-xs text-white/60 mb-1">Edificio</p>
                        <div className="px-3 py-1 rounded-lg bg-white/10">
                          <span className="text-sm font-semibold text-white truncate block">
                            {tenant.apartmentInfo?.buildingName || '-'}
                          </span>
                        </div>
                      </div>

                      {/* Unit */}
                      <div className="text-center min-w-[100px]">
                        <p className="text-xs text-white/60 mb-1">Unidad</p>
                        <div className="px-3 py-1 rounded-lg bg-white/10">
                          <span className="text-sm font-semibold text-white">
                            {tenant.apartmentInfo?.unitName || '-'}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="text-center">
                        <p className="text-xs text-white/60 mb-1">Estado</p>
                        <div className={`px-3 py-1 rounded-lg ${
                          tenant.isActive 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          <span className="text-sm font-semibold">
                            {tenant.isActive ? 'Activo' : 'Inactivo'}
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
                      onClick={() => setExpandedClient(expandedClient === tenant.id ? null : tenant.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                          <User className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{tenant.nameOrBusiness}</p>
                          <p className="text-xs text-white/60 truncate">
                            {tenant.contactPhone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`px-2 py-1 rounded-lg text-xs ${
                          tenant.isActive 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {tenant.isActive ? 'Activo' : 'Inactivo'}
                        </div>
                        <ChevronDown 
                          className={`h-5 w-5 text-white/60 transition-transform ${
                            expandedClient === tenant.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedClient === tenant.id && (
                      <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                        {/* Rental Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Edificio</p>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-white/60" />
                              <p className="text-sm text-white">{tenant.apartmentInfo?.buildingName || '-'}</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Unidad</p>
                            <div className="flex items-center gap-2">
                              <Home className="h-4 w-4 text-white/60" />
                              <p className="text-sm text-white">{tenant.apartmentInfo?.unitName || '-'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                          <p className="text-xs text-white/60 mb-1">Información de Contacto</p>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-white">
                              <Phone className="h-4 w-4 mr-2 text-white/60" />
                              <span>{tenant.contactPhone}</span>
                            </div>
                            <div className="flex items-center text-sm text-white">
                              <Mail className="h-4 w-4 mr-2 text-white/60" />
                              <span className="truncate">{tenant.contactEmail}</span>
                            </div>
                          </div>
                        </div>

                        {/* DNI/CUIT */}
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-white/60 mb-1">DNI/CUIT</p>
                          <p className="text-sm text-white">{tenant.dniOrCuit}</p>
                        </div>

                        {/* Address */}
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-white/60 mb-1">Dirección</p>
                          <p className="text-sm text-white">{tenant.address}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            className="flex-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                            onClick={() => router.push(`/clients/${tenant.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirm(tenant.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCardContent>
      </GlassCard>

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
                ¿Está seguro que desea eliminar este cliente?
              </p>
              <p className="text-sm text-white/60">
                Esta acción no se puede deshacer. Se eliminarán también todos los garantes asociados.
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
