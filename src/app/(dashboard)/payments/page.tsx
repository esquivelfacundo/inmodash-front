'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DollarSign, Plus, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { usePayments } from '@/hooks/usePayments'
import { PaymentStatus } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function PaymentsPage() {
  const router = useRouter()
  const { payments, loading, markAsPaid } = usePayments()

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-500/20 text-green-300'
      case PaymentStatus.PENDING:
        return 'bg-yellow-500/20 text-yellow-300'
      case PaymentStatus.OVERDUE:
        return 'bg-red-500/20 text-red-300'
      default:
        return 'bg-slate-800/50 text-white'
    }
  }

  const getStatusLabel = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'Pagado'
      case PaymentStatus.PENDING:
        return 'Pendiente'
      case PaymentStatus.OVERDUE:
        return 'Vencido'
      default:
        return status
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <CheckCircle className="h-4 w-4" />
      case PaymentStatus.PENDING:
        return <Clock className="h-4 w-4" />
      case PaymentStatus.OVERDUE:
        return <AlertCircle className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const handleMarkAsPaid = async (id: number) => {
    if (confirm('¿Marcar este pago como pagado?')) {
      try {
        await markAsPaid(id)
      } catch (error) {
        // Error already handled in hook
      }
    }
  }

  if (loading) {
    return <Loading size="lg" text="Cargando pagos..." />
  }

  const pendingPayments = payments.filter(p => p.status === PaymentStatus.PENDING)
  const overduePayments = payments.filter(p => p.status === PaymentStatus.OVERDUE)
  const paidPayments = payments.filter(p => p.status === PaymentStatus.PAID)

  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Pagos</h1>
          <p className="text-white/60 mt-2">
            Gestiona los pagos de alquileres
          </p>
        </div>
        <Link href="/payments/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Pago
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pagos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              ${totalPending.toLocaleString('es-AR')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overduePayments.length}</div>
            <p className="text-xs text-muted-foreground">
              ${totalOverdue.toLocaleString('es-AR')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidPayments.length}</div>
            <p className="text-xs text-muted-foreground">
              ${totalPaid.toLocaleString('es-AR')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <DollarSign className="h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No hay pagos registrados
            </h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              Comienza registrando los pagos de alquileres.
            </p>
            <Link href="/payments/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Primer Pago
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Listado de Pagos</CardTitle>
            <CardDescription>
              {payments.length} pago(s) registrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">
                          ${payment.amount.toLocaleString('es-AR')}
                        </h4>
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusLabel(payment.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(payment.month), 'MMMM yyyy', { locale: es })}
                          </span>
                        </div>
                        {payment.contract && (
                          <span>
                            Contrato #{payment.contractId}
                          </span>
                        )}
                      </div>
                      {payment.notes && (
                        <p className="text-xs text-gray-500 mt-1">{payment.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {payment.status === PaymentStatus.PENDING && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsPaid(Number(payment.id))}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Marcar Pagado
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/payments/${payment.id}`)}
                    >
                      Ver Detalle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
