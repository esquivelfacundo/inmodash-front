'use client'

import Link from 'next/link'
import { Building2, Home, Plus, TrendingUp, Users, DollarSign, ArrowRight, Sparkles, UserCircle, MapPin, AlertCircle, Clock, CheckCircle, FileText, Calendar, Bell, Zap } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { GlassStatCard } from '@/components/ui/glass-stat-card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Loading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { useDashboard } from '@/hooks/useDashboard'
import { useBuildings } from '@/hooks/useBuildings'
import { useApartments } from '@/hooks/useApartments'
import { usePayments, usePendingPayments, useOverduePayments } from '@/hooks/usePayments'
import { useContracts } from '@/hooks/useContracts'
import { formatArea, formatRooms } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PaymentStatus } from '@/types'

export default function Dashboard() {
  const { stats, loading: statsLoading } = useDashboard()
  const { buildings, loading: buildingsLoading } = useBuildings()
  const { apartments, loading: apartmentsLoading } = useApartments()
  const { payments, loading: paymentsLoading } = usePayments()
  const { payments: pendingPayments } = usePendingPayments()
  const { payments: overduePayments } = useOverduePayments()
  const { contracts, loading: contractsLoading } = useContracts()

  const loading = statsLoading || buildingsLoading || apartmentsLoading || paymentsLoading || contractsLoading

  // Get recent buildings (last 3)
  const recentBuildings = buildings.slice(-3).reverse()
  
  // Get recent apartments (last 5)
  const recentApartments = apartments.slice(-5).reverse()
  
  // Get recent payments (last 5)
  const recentPayments = payments.slice(-5).reverse()
  
  // Get contracts expiring soon (next 30 days)
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
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
          title="Total Edificios"
          value={stats.totalBuildings}
          icon={Building2}
        />
        <GlassStatCard
          title="Total Propiedades"
          value={stats.totalApartments}
          icon={Home}
        />
        <GlassStatCard
          title="Propietarios"
          value={stats.totalOwners}
          icon={UserCircle}
        />
        <GlassStatCard
          title="Contratos Activos"
          value={stats.activeContracts}
          icon={TrendingUp}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassStatCard
          title="Disponibles"
          value={stats.availableApartments}
          icon={Plus}
        />
        <GlassStatCard
          title="Alquilados"
          value={stats.rentedApartments}
          icon={TrendingUp}
        />
        <GlassStatCard
          title="Independientes"
          value={stats.independentApartments}
          icon={MapPin}
        />
        <GlassStatCard
          title="Clientes"
          value={stats.totalTenants}
          icon={Users}
        />
      </div>

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
                      Total: ${overduePayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('es-AR')}
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
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <GlassCard className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:shadow-lg hover:shadow-green-500/20 transition-all">
          <GlassCardHeader>
            <GlassCardTitle className="flex items-center gap-2 text-white">
              🏷️ En Venta
            </GlassCardTitle>
            <GlassCardDescription className="text-white/60">
              Departamentos disponibles para la venta
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="text-4xl font-bold text-green-400">
              {stats.apartmentsForSale}
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Recent Activity - Extended */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent buildings */}
        <GlassCard className="hover:shadow-lg transition-all">
          <GlassCardHeader className="flex flex-row items-center justify-between">
            <div>
              <GlassCardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-blue-400" />
                Edificios Recientes
              </GlassCardTitle>
              <GlassCardDescription className="text-white/60">
                Últimos edificios agregados
              </GlassCardDescription>
            </div>
            <Link href="/buildings">
              <Button variant="outline" size="sm" className="gap-1 bg-white/5 text-white hover:bg-white/10 hover:shadow-lg transition-all">
                Ver todos
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </GlassCardHeader>
          <GlassCardContent>
            {recentBuildings.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No hay edificios registrados"
                description="Comienza creando tu primer edificio"
                action={{
                  label: 'Crear Edificio',
                  onClick: () => window.location.href = '/buildings/new'
                }}
              />
            ) : (
              <div className="space-y-2">
                {recentBuildings.map((building) => (
                  <Link
                    key={building.id}
                    href={`/buildings/${building.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-blue-500/20 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                          <Building2 className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {building.name}
                          </h4>
                          <p className="text-sm text-white/60 flex items-center gap-2 mt-1">
                            <span>{building.address}</span>
                            <Badge variant="outline" size="sm">
                              {building.apartments?.length || 0} dptos
                            </Badge>
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Recent Apartments */}
        <GlassCard className="hover:shadow-lg transition-all">
          <GlassCardHeader className="flex flex-row items-center justify-between">
            <div>
              <GlassCardTitle className="flex items-center gap-2 text-white">
                <Home className="h-5 w-5 text-green-400" />
                Departamentos Recientes
              </GlassCardTitle>
              <GlassCardDescription className="text-white/60">
                Últimos departamentos agregados
              </GlassCardDescription>
            </div>
          </GlassCardHeader>
          <GlassCardContent>
            {recentApartments.length === 0 ? (
              <EmptyState
                icon={Home}
                title="No hay departamentos registrados"
                description="Primero crea un edificio para agregar departamentos"
              />
            ) : (
              <div className="space-y-2">
                {recentApartments.map((apartment) => (
                  <Link
                    key={apartment.id}
                    href={`/apartments/${apartment.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-green-500/20 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                          <Home className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                            {apartment.building?.name} - {apartment.nomenclature}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-white/60">
                              {apartment.area ? formatArea(apartment.area) : 'N/A'} • {apartment.rooms ? formatRooms(apartment.rooms) : 'N/A'}
                            </p>
                            <Badge variant="outline" size="sm">
                              {apartment.uniqueId}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>

        {/* Recent Payments */}
        <GlassCard className="hover:shadow-lg transition-all">
          <GlassCardHeader className="flex flex-row items-center justify-between">
            <div>
              <GlassCardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 text-purple-400" />
                Pagos Recientes
              </GlassCardTitle>
              <GlassCardDescription className="text-white/60">
                Últimos pagos registrados
              </GlassCardDescription>
            </div>
            <Link href="/payments">
              <Button variant="outline" size="sm" className="gap-1 bg-white/5 text-white hover:bg-white/10 hover:shadow-lg transition-all">
                Ver todos
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </GlassCardHeader>
          <GlassCardContent>
            {recentPayments.length === 0 ? (
              <EmptyState
                icon={DollarSign}
                title="No hay pagos registrados"
                description="Los pagos aparecerán aquí cuando se registren"
              />
            ) : (
              <div className="space-y-2">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-purple-500/20 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        payment.status === PaymentStatus.PAID 
                          ? 'bg-green-500/20' 
                          : payment.status === PaymentStatus.OVERDUE
                          ? 'bg-red-500/20'
                          : 'bg-yellow-500/20'
                      }`}>
                        {payment.status === PaymentStatus.PAID ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : payment.status === PaymentStatus.OVERDUE ? (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          ${payment.amount.toLocaleString('es-AR')}
                        </h4>
                        <p className="text-sm text-white/60">
                          {format(new Date(payment.month), 'MMMM yyyy', { locale: es })}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={`${
                        payment.status === PaymentStatus.PAID 
                          ? 'bg-green-500/20 text-green-300' 
                          : payment.status === PaymentStatus.OVERDUE
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {payment.status === PaymentStatus.PAID ? 'Pagado' : 
                       payment.status === PaymentStatus.OVERDUE ? 'Vencido' : 'Pendiente'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  )
}
