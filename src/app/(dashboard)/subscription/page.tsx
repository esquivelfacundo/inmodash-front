'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { getMySubscription, createSubscription, cancelSubscription } from '@/services/subscription.service'

interface Subscription {
  id: number
  plan: string
  status: string
  amount: number
  currency: string
  nextBillingDate: string | null
  startDate: string
  isTrialActive: boolean
  trialEndDate: string | null
  payments: Payment[]
}

interface Payment {
  id: number
  amount: number
  currency: string
  status: string
  paidAt: string | null
  createdAt: string
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mercadopagoUrl, setMercadopagoUrl] = useState<string | null>(null)

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Obtener token de las cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1]

      if (!token) {
        // Si no hay token, el usuario no está autenticado
        // No mostrar error, simplemente no cargar suscripción
        return
      }

      const data = await getMySubscription(token)
      setSubscription(data)
    } catch (err) {
      console.error('Error loading subscription:', err)
      setError('Error al cargar la suscripción')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSubscription = async () => {
    setIsCreatingSubscription(true)
    setError(null)
    setMercadopagoUrl(null)

    try {
      // Obtener token de las cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1]

      if (!token) {
        setError('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.')
        return
      }

      // Obtener email del usuario desde el backend usando el token
      const userResponse = await fetch('https://inmodash-back-production.up.railway.app/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })

      if (!userResponse.ok) {
        setError('Error al obtener datos del usuario')
        return
      }

      const userData = await userResponse.json()
      const email = userData.user?.email

      if (!email) {
        setError('No se pudo obtener el email del usuario')
        return
      }

      const result = await createSubscription(
        {
          email,
          plan: 'professional',
          amount: 289,
          currency: 'USD',
        },
        token
      )

      if (result.success && result.initPoint) {
        setMercadopagoUrl(result.initPoint)
        // Abrir MercadoPago en nueva ventana
        window.open(result.initPoint, '_blank')
        // Recargar suscripción después de unos segundos
        setTimeout(() => {
          loadSubscription()
        }, 3000)
      } else {
        setError(result.error || 'Error al crear la suscripción')
      }
    } catch (err) {
      console.error('Error creating subscription:', err)
      setError('Error inesperado al crear la suscripción')
    } finally {
      setIsCreatingSubscription(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('¿Estás seguro de que deseas cancelar tu suscripción?')) {
      return
    }

    setIsCancelling(true)
    setError(null)

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1]

      if (!token) {
        setError('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.')
        return
      }

      const success = await cancelSubscription(token)
      
      if (success) {
        alert('Suscripción cancelada exitosamente')
        loadSubscription()
      } else {
        setError('Error al cancelar la suscripción')
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err)
      setError('Error inesperado al cancelar la suscripción')
    } finally {
      setIsCancelling(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; text: string }> = {
      pending: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Clock, text: 'Pendiente' },
      authorized: { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle2, text: 'Activa' },
      paused: { color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: Clock, text: 'Pausada' },
      cancelled: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle, text: 'Cancelada' },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="h-4 w-4" />
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mi Suscripción</h1>
        <p className="text-white/70">Gestiona tu plan y métodos de pago</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* MercadoPago URL */}
      {mercadopagoUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <ExternalLink className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-blue-900 mb-1">Ventana de pago abierta</p>
            <p className="text-sm text-blue-700 mb-3">
              Se ha abierto una nueva ventana con MercadoPago. Si no se abrió automáticamente, haz clic en el botón de abajo.
            </p>
            <a
              href={mercadopagoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all"
            >
              Abrir MercadoPago
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* No Subscription */}
      {!subscription && !isLoading && (
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-8 backdrop-blur-sm">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No tienes una suscripción activa
            </h2>
            <p className="text-white/70 mb-6">
              Actualmente estás en período de prueba. Configura tu suscripción para continuar usando InmoDash después del trial.
            </p>
            <button
              onClick={handleCreateSubscription}
              disabled={isCreatingSubscription}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingSubscription ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creando suscripción...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Configurar Suscripción con MercadoPago
                </>
              )}
            </button>
            <p className="text-sm text-white/60 mt-4">
              $289 USD/mes - Pago recurrente cada 30 días
            </p>
          </div>
        </div>
      )}

      {/* Active Subscription */}
      {subscription && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Plan {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                  </h2>
                  <p className="text-white/60">ID: #{subscription.id}</p>
                </div>
                {getStatusBadge(subscription.status)}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">Monto</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(subscription.amount, subscription.currency)}
                  </p>
                  <p className="text-sm text-white/60">por mes</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Próximo pago</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {formatDate(subscription.nextBillingDate)}
                  </p>
                </div>
              </div>

              {subscription.isTrialActive && subscription.trialEndDate && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-1">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-medium">Período de prueba activo</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Tu trial termina el {formatDate(subscription.trialEndDate)}
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-white/60 mb-2">Fecha de inicio</p>
                <p className="text-white font-medium">{formatDate(subscription.startDate)}</p>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">Historial de Pagos</h3>
              
              {subscription.payments && subscription.payments.length > 0 ? (
                <div className="space-y-3">
                  {subscription.payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.status === 'approved' ? 'bg-green-500/20' : 'bg-white/10'
                        }`}>
                          {payment.status === 'approved' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {formatCurrency(payment.amount, payment.currency)}
                          </p>
                          <p className="text-sm text-white/60">
                            {formatDate(payment.paidAt || payment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'approved' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {payment.status === 'approved' ? 'Aprobado' : payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 text-center py-8">
                  No hay pagos registrados aún
                </p>
              )}
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-sm backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">Acciones</h3>
              
              <div className="space-y-3">
                <button
                  onClick={loadSubscription}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
                >
                  Actualizar Estado
                </button>

                {subscription.status === 'authorized' && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? 'Cancelando...' : 'Cancelar Suscripción'}
                  </button>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="font-semibold text-blue-400 mb-2">Información</h4>
              <p className="text-sm text-blue-300">
                Tu suscripción se renueva automáticamente cada mes. Puedes cancelarla en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
