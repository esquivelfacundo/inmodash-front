'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
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
import { CardPaymentForm } from '@/components/subscription/card-payment-form'

// Public Key de MercadoPago (nueva app - usar la de producción o test según configuración)
const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-28f83d59-0a3e-4a10-98ad-3c69a48ab570'

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
      // Las cookies se envían automáticamente con credentials: 'include'
      const data = await getMySubscription()
      setSubscription(data)
    } catch (err) {
      console.error('Error loading subscription:', err)
      setError('Error al cargar la suscripción')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardTokenCreated = async (cardToken: string) => {
    setIsCreatingSubscription(true)
    setError(null)

    try {
      // Obtener email del usuario desde el backend usando las cookies
      const userResponse = await fetch('https://inmodash-back-production.up.railway.app/api/auth/me', {
        credentials: 'include'
      })

      if (!userResponse.ok) {
        setError('Error de autenticación. Por favor, cierra sesión e inicia sesión nuevamente.')
        setIsCreatingSubscription(false)
        return
      }

      const userData = await userResponse.json()
      const email = userData.user?.email

      if (!email) {
        setError('No se pudo obtener el email del usuario')
        setIsCreatingSubscription(false)
        return
      }

      // Crear suscripción con el token de la tarjeta
      const result = await createSubscription({
        email,
        plan: 'professional',
        amount: 15,
        currency: 'ARS',
        cardToken,
      })

      if (result.success) {
        // La suscripción se creó y autorizó exitosamente
        setError(null)
        // Recargar la suscripción para mostrar el estado actualizado
        await loadSubscription()
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
      // Las cookies se envían automáticamente
      const success = await cancelSubscription()
      
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
      pending: { color: 'bg-yellow-500/20 text-yellow-300 backdrop-blur-sm shadow-lg', icon: Clock, text: 'Pendiente' },
      authorized: { color: 'bg-green-500/20 text-green-300 backdrop-blur-sm shadow-lg', icon: CheckCircle2, text: 'Activa' },
      paused: { color: 'bg-gray-500/20 text-gray-300 backdrop-blur-sm shadow-lg', icon: Clock, text: 'Pausada' },
      cancelled: { color: 'bg-red-500/20 text-red-300 backdrop-blur-sm shadow-lg', icon: XCircle, text: 'Cancelada' },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${config.color}`}>
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
      <>
        <Script src="https://sdk.mercadopago.com/js/v2" strategy="beforeInteractive" />
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Script src="https://sdk.mercadopago.com/js/v2" strategy="beforeInteractive" />
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
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Configura tu Suscripción
              </h2>
              <p className="text-white/70 mb-2">
                Completa los datos de tu tarjeta para activar tu suscripción
              </p>
              <p className="text-sm text-white/60">
                $15 ARS/mes - Pago recurrente cada 30 días
              </p>
            </div>

            {/* Formulario de tarjeta */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <CardPaymentForm
                publicKey={MP_PUBLIC_KEY}
                onTokenCreated={handleCardTokenCreated}
                onError={setError}
                isLoading={isCreatingSubscription}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Subscription */}
      {subscription && (
        <div className="space-y-6">
          {/* Main Subscription Card - Full Width */}
          <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Plan {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                    </h2>
                    <p className="text-white/50 text-sm">ID: #{subscription.id}</p>
                  </div>
                </div>
              </div>
              {getStatusBadge(subscription.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Monto */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 text-white/60 mb-3">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">Monto Mensual</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {formatCurrency(subscription.amount, subscription.currency)}
                </p>
                <p className="text-sm text-white/50">Renovación automática</p>
              </div>

              {/* Próximo Pago */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 text-white/60 mb-3">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Próximo Pago</span>
                </div>
                <p className="text-xl font-semibold text-white mb-1">
                  {formatDate(subscription.nextBillingDate)}
                </p>
                <p className="text-sm text-white/50">Fecha estimada</p>
              </div>

              {/* Fecha de Inicio */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 text-white/60 mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Suscrito Desde</span>
                </div>
                <p className="text-xl font-semibold text-white mb-1">
                  {formatDate(subscription.startDate)}
                </p>
                <p className="text-sm text-white/50">Fecha de activación</p>
              </div>
            </div>

            {subscription.isTrialActive && subscription.trialEndDate && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl shadow-lg">
                <div className="flex items-center gap-2 text-green-300 mb-1">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">Período de prueba activo</span>
                </div>
                <p className="text-sm text-green-200/80">
                  Tu trial termina el {formatDate(subscription.trialEndDate)}
                </p>
              </div>
            )}
          </div>

          {/* Grid Layout for History and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment History - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Historial de Pagos</h3>
                  <span className="text-sm text-white/50">
                    {subscription.payments?.length || 0} {subscription.payments?.length === 1 ? 'pago' : 'pagos'}
                  </span>
                </div>
                
                {subscription.payments && subscription.payments.length > 0 ? (
                  <div className="space-y-3">
                    {subscription.payments.map((payment) => (
                      <div 
                        key={payment.id} 
                        className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg ${
                            payment.status === 'approved' 
                              ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' 
                              : 'bg-white/10'
                          }`}>
                            {payment.status === 'approved' ? (
                              <CheckCircle2 className="h-6 w-6 text-green-400" />
                            ) : (
                              <Clock className="h-6 w-6 text-white/60" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-lg">
                              {formatCurrency(payment.amount, payment.currency)}
                            </p>
                            <p className="text-sm text-white/50">
                              {formatDate(payment.paidAt || payment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm shadow-lg ${
                          payment.status === 'approved' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-white/10 text-white/70'
                        }`}>
                          {payment.status === 'approved' ? 'Aprobado' : payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-8 w-8 text-white/30" />
                    </div>
                    <p className="text-white/60 font-medium mb-1">No hay pagos registrados</p>
                    <p className="text-white/40 text-sm">Los pagos aparecerán aquí una vez procesados</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Sidebar - Takes 1 column */}
            <div className="space-y-6">
              {/* Actions Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Acciones</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={loadSubscription}
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all font-medium shadow-lg"
                  >
                    Actualizar Estado
                  </button>

                  {subscription.status === 'authorized' && (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isCancelling}
                      className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-red-300 rounded-xl transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCancelling ? 'Cancelando...' : 'Cancelar Suscripción'}
                    </button>
                  )}
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">Información</h4>
                    <p className="text-sm text-blue-200/80 leading-relaxed">
                      Tu suscripción se renueva automáticamente cada mes. Puedes cancelarla en cualquier momento sin cargos adicionales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
