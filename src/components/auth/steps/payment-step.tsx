'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Lock, AlertCircle, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react'
import { RegistrationData } from '../multi-step-register'
import { createSubscription } from '@/services/subscription.service'

interface PaymentStepProps {
  data: Partial<RegistrationData>
  updateData: (data: Partial<RegistrationData>) => void
  onSubmit: () => void
  onBack: () => void
  isLoading: boolean
  accessToken?: string
}

export function PaymentStep({ data, updateData, onSubmit, onBack, isLoading, accessToken }: PaymentStepProps) {
  const [skipPayment, setSkipPayment] = useState(true)
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false)
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null)
  const [mercadopagoUrl, setMercadopagoUrl] = useState<string | null>(null)

  const handleSkipAndRegister = () => {
    updateData({ paymentMethod: 'trial' })
    onSubmit()
  }

  const handleCreateSubscription = async () => {
    if (!data.email) {
      setSubscriptionError('Email no disponible')
      return
    }

    setIsCreatingSubscription(true)
    setSubscriptionError(null)

    try {
      const result = await createSubscription({
        email: data.email,
        plan: 'professional',
        amount: 1,
        currency: 'ARS',
      })

      if (result.success && result.initPoint) {
        // Guardar URL de MercadoPago y abrir en nueva pestaña
        setMercadopagoUrl(result.initPoint)
        window.open(result.initPoint, '_blank')
        
        // Esperar un momento y completar el registro
        setTimeout(() => {
          onSubmit()
        }, 2000)
      } else {
        setSubscriptionError(result.error || 'Error al crear la suscripción')
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      setSubscriptionError('Error inesperado al crear la suscripción')
    } finally {
      setIsCreatingSubscription(false)
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la integración con la pasarela de pagos
    onSubmit()
  }

  return (
    <div className="space-y-6">
      {/* Trial Banner */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 glass">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <Sparkles className="h-6 w-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              ¡Comienza tu prueba gratuita de 30 días!
            </h3>
            <p className="text-white/80 mb-3">
              No se requiere tarjeta de crédito. Puedes comenzar a usar el sistema inmediatamente
              y configurar tu método de pago más adelante.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Acceso completo a todas las funcionalidades
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Sin compromiso ni cargos automáticos
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Cancela en cualquier momento
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Error de suscripción */}
      {subscriptionError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-400 mb-1">Error al crear suscripción</p>
              <p className="text-sm text-red-300">{subscriptionError}</p>
            </div>
          </div>
        </div>
      )}

      {/* URL de MercadoPago */}
      {mercadopagoUrl && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-400 mb-1">Ventana de pago abierta</p>
              <p className="text-sm text-blue-300 mb-2">
                Se ha abierto una nueva ventana con MercadoPago. Si no se abrió automáticamente, haz clic en el botón de abajo.
              </p>
              <a
                href={mercadopagoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all"
              >
                Abrir MercadoPago
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Opciones de Pago */}
      <div className="space-y-4">
        {/* Opción: Comenzar Trial */}
        <div
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
            skipPayment
              ? 'border-green-500/50 bg-green-500/10'
              : 'border-white/10 hover:border-white/20 bg-slate-800/20'
          }`}
          onClick={() => setSkipPayment(true)}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              checked={skipPayment}
              onChange={() => setSkipPayment(true)}
              className="h-5 w-5 text-green-600"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">
                Comenzar período de prueba gratuito
              </p>
              <p className="text-sm text-white/70">
                Configura tu método de pago más adelante
              </p>
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              Recomendado
            </div>
          </div>
        </div>

        {/* Opción: Pagar Ahora con MercadoPago */}
        <div
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
            !skipPayment
              ? 'border-blue-500/50 bg-blue-500/10'
              : 'border-white/10 hover:border-white/20 bg-slate-800/20'
          }`}
          onClick={() => setSkipPayment(false)}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              checked={!skipPayment}
              onChange={() => setSkipPayment(false)}
              className="h-5 w-5 text-cyan-400"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">
                Configurar suscripción con MercadoPago
              </p>
              <p className="text-sm text-white/70">
                $289 USD/mes - Pago recurrente cada 30 días
              </p>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              Disponible
            </div>
          </div>
          
          {!skipPayment && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCreateSubscription()
                }}
                disabled={isCreatingSubscription}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingSubscription ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creando suscripción...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Configurar pago con MercadoPago
                  </>
                )}
              </button>
              <p className="text-xs text-white/60 text-center mt-2">
                Serás redirigido a MercadoPago para completar el pago
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Tarjeta (Oculto si se salta el pago) */}
      {!skipPayment && (
        <form onSubmit={handlePaymentSubmit} className="space-y-4 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-white/70" />
            <p className="text-sm text-white/70">
              Pago seguro y encriptado
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Número de Tarjeta
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent pl-12"
                maxLength={19}
              />
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Fecha de Vencimiento
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                maxLength={4}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Nombre en la Tarjeta
            </label>
            <input
              type="text"
              placeholder="JUAN PEREZ"
              className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </form>
      )}

      {/* Información de Seguridad */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-white mb-1">Pago 100% seguro</p>
            <p className="text-white/70">
              Tus datos están protegidos con encriptación SSL de 256 bits.
              No almacenamos información de tarjetas de crédito.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
