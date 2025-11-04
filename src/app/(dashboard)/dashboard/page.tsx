'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Home, Plus, TrendingUp, FileText, MapPin, Users, DollarSign, ArrowRight, Clock, CheckCircle, AlertCircle, Calendar, Bell, Zap } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { GlassStatCard } from '@/components/ui/glass-stat-card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { useDashboard } from '@/hooks/useDashboard'
import { useBuildings } from '@/hooks/useBuildings'
import { useApartments } from '@/hooks/useApartments'
import { useContracts } from '@/hooks/useContracts'
import { usePayments, usePendingPayments, useOverduePayments } from '@/hooks/usePayments'
import { ApartmentStatus, PaymentStatus } from '@/types'
import { formatArea, formatRooms } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { EmptyState } from '@/components/ui/empty-state'

type PropertyFilter = 'all' | 'departamentos' | 'casas' | 'cocheras' | 'locales'

export default function Dashboard() {
  const router = useRouter()
  const { stats, loading: statsLoading } = useDashboard()
  const { buildings, loading: buildingsLoading } = useBuildings()
  const { apartments, loading: apartmentsLoading } = useApartments()
  const { contracts, loading: contractsLoading } = useContracts()
  const { payments, loading: paymentsLoading } = usePayments()
  const { payments: pendingPayments } = usePendingPayments()
  const { payments: overduePayments } = useOverduePayments()
  const [propertyFilter, setPropertyFilter] = useState<PropertyFilter>('all')

  const loading = statsLoading || buildingsLoading || apartmentsLoading || contractsLoading || paymentsLoading

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

  // Get recent data
  const recentBuildings = buildings.slice(-3).reverse()
  const recentApartments = apartments.slice(-5).reverse()
  const recentPayments = payments.slice(-5).reverse()
  
  // Get contracts expiring soon
  const expiringContracts = contracts.filter(contract => {
    const endDate = new Date(contract.endDate)
    return endDate >= today && endDate <= thirtyDaysFromNow
  })
  
  // Calculate occupancy rate
  const occupancyRate = stats.totalApartments > 0 
    ? ((stats.rentedApartments / stats.totalApartments) * 100).toFixed(1)
    : 0

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

      {/* Payments Approval Table */}
      <GlassCard>
        <GlassCardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <GlassCardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5" />
                Pagos Pendientes de Aprobación
              </GlassCardTitle>
              <GlassCardDescription className="text-white/60">
                Gestiona los pagos registrados por los inquilinos
              </GlassCardDescription>
            </div>
            <Link href="/payments">
              <Button variant="outline" className="gap-2 bg-white/5 text-white hover:bg-white/10">
                <DollarSign className="h-4 w-4" />
                Ver Todos los Pagos
              </Button>
            </Link>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              {recentPayments.length > 0 && (
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Inquilino</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/80">Unidad</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white/80">Monto a Pagar</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white/80">Comprobante</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white/80">Estado</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-white/80">Acciones</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <DollarSign className="h-12 w-12 text-white/20" />
                        <p className="text-white font-medium">No hay pagos registrados</p>
                        <p className="text-white/60 text-sm">Los pagos aparecerán aquí cuando se registren</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentPayments.map((payment: any) => (
                    <tr
                      key={payment.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/20">
                            <Users className="h-4 w-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {payment.tenant?.name || 'Sin inquilino'}
                            </p>
                            <p className="text-sm text-white/60">
                              {payment.tenant?.email || '-'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-400" />
                          <div>
                            <p className="font-medium text-white">
                              {payment.apartment?.building?.name || 'Propiedad'}
                            </p>
                            <p className="text-sm text-white/60">
                              {payment.apartment?.nomenclature || '-'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="font-semibold text-green-400">
                          ${payment.amount?.toLocaleString('es-AR') || 0}
                        </div>
                        <p className="text-xs text-white/60 mt-1">
                          {format(new Date(payment.month), 'MMM yyyy', { locale: es })}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {payment.receiptUrl ? (
                          <a
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">Ver</span>
                          </a>
                        ) : (
                          <span className="text-white/40 text-sm">Sin comprobante</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge 
                          className={`${
                            payment.status === PaymentStatus.PAID 
                              ? 'bg-green-500/20 text-green-300' 
                              : payment.status === PaymentStatus.OVERDUE
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {payment.status === PaymentStatus.PAID ? 'Aprobado' : 
                           payment.status === PaymentStatus.OVERDUE ? 'Rechazado' : 'Pendiente'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {payment.status === PaymentStatus.PENDING && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500/20 text-green-300 hover:bg-green-500/30"
                                onClick={() => {
                                  // TODO: Implement approve payment
                                  console.log('Approve payment:', payment.id)
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                onClick={() => {
                                  // TODO: Implement reject payment
                                  console.log('Reject payment:', payment.id)
                                }}
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {payment.status !== PaymentStatus.PENDING && (
                            <span className="text-white/40 text-sm">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Alerts Section */}
      {(overduePayments.length > 0 || expiringContracts.length > 0) && (
        <GlassCard className="shadow-lg shadow-red-500/20">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5" />
              Alertas Importantes
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              {overduePayments.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">
                      {overduePayments.length} pago{overduePayments.length > 1 ? 's' : ''} vencido{overduePayments.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-red-700">
                      Total: ${overduePayments.reduce((sum: number, p: any) => sum + p.amount, 0).toLocaleString('es-AR')}
                    </p>
                  </div>
                  <Link href="/payments">
                    <Button size="sm" variant="outline" className="bg-red-500/10 text-red-300 hover:bg-red-500/20">
                      Ver pagos
                    </Button>
                  </Link>
                </div>
              )}
              {expiringContracts.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-orange-900">
                      {expiringContracts.length} contrato{expiringContracts.length > 1 ? 's' : ''} por vencer
                    </p>
                    <p className="text-sm text-orange-700">
                      En los próximos 30 días
                    </p>
                  </div>
                  <Link href="/contracts">
                    <Button size="sm" variant="outline" className="bg-orange-500/10 text-orange-300 hover:bg-orange-500/20">
                      Ver contratos
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </GlassCardContent>
        </GlassCard>
      )}

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:shadow-lg hover:shadow-green-500/20 transition-all">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="h-5 w-5 text-green-400" />
              Ingresos del Mes
            </GlassCardTitle>
            <GlassCardDescription className="text-white/60">
              Total recaudado este mes
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-3xl font-bold text-green-400">
              ${stats.totalRevenue?.toLocaleString('es-AR') || 0}
            </div>
            <p className="text-sm text-white/60 mt-2">
              {stats.paidThisMonth || 0} pagos registrados
            </p>
          </GlassCardContent>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 hover:shadow-lg hover:shadow-yellow-500/20 transition-all">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-yellow-400" />
              Pagos Pendientes
            </GlassCardTitle>
            <GlassCardDescription className="text-white/60">
              Por cobrar
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-3xl font-bold text-yellow-400">
              ${stats.pendingAmount?.toLocaleString('es-AR') || 0}
            </div>
            <p className="text-sm text-white/60 mt-2">
              {stats.pendingPayments || 0} pagos pendientes
            </p>
          </GlassCardContent>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Comisiones
            </GlassCardTitle>
            <GlassCardDescription className="text-white/60">
              Generadas este mes
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-3xl font-bold text-blue-400">
              ${stats.totalCommissions?.toLocaleString('es-AR') || 0}
            </div>
            <p className="text-sm text-white/60 mt-2">
              De {stats.totalRevenue || 0} total
            </p>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-purple-400" />
            Acciones Rápidas
          </GlassCardTitle>
          <GlassCardDescription className="text-white/60">
            Accesos directos a las funciones más utilizadas
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/payments/new">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-white/5 text-white hover:bg-white/10 hover:shadow-lg transition-all">
                <DollarSign className="h-5 w-5 text-green-400" />
                <span className="text-sm">Registrar Pago</span>
              </Button>
            </Link>
            <Link href="/contracts/new">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-white/5 text-white hover:bg-white/10 hover:shadow-lg transition-all">
                <FileText className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Nuevo Contrato</span>
              </Button>
            </Link>
            <Link href="/documents/new">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-white/5 text-white hover:bg-white/10 hover:shadow-lg transition-all">
                <FileText className="h-5 w-5 text-purple-400" />
                <span className="text-sm">Subir Documento</span>
              </Button>
            </Link>
            <Link href="/payments">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-white/5 text-white hover:bg-white/10 hover:shadow-lg transition-all">
                <Clock className="h-5 w-5 text-orange-400" />
                <span className="text-sm">Ver Pendientes</span>
              </Button>
            </Link>
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Tasa de Ocupación
            </GlassCardTitle>
            <GlassCardDescription className="text-white/60">
              Propiedades alquiladas vs disponibles
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-4xl font-bold text-cyan-400">
              {occupancyRate}%
            </div>
            <div className="mt-4 bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-500"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
            <p className="text-sm text-white/60 mt-2">
              {stats.rentedApartments} de {stats.totalApartments} propiedades alquiladas
            </p>
          </GlassCardContent>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="h-5 w-5 text-blue-400" />
              Área Total
            </GlassCardTitle>
            <GlassCardDescription className="text-white/60">
              Superficie total de todos los departamentos
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-4xl font-bold text-blue-400">
              {formatArea(stats.totalArea)}
            </div>
          </GlassCardContent>
        </GlassCard>
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
