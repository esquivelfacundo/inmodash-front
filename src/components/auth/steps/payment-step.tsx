'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Lock, AlertCircle, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react'
import { RegistrationData } from '../multi-step-register'
import { createSubscription } from '@/services/subscription.service'
import { CardPaymentForm } from '@/components/subscription/card-payment-form'

// Public Key de MercadoPago (nueva app)
const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'APP_USR-28f83d59-0a3e-4a10-98ad-3c69a48ab570'

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

  const handleCardTokenCreated = async (cardToken: string) => {
    setIsCreatingSubscription(true)
    setSubscriptionError(null)

    try {
      // Obtener email del usuario desde el backend usando las cookies
      const userResponse = await fetch('https://inmodash-back-production.up.railway.app/api/auth/me', {
        credentials: 'include'
      })

      if (!userResponse.ok) {
        setSubscriptionError('Error de autenticación. Por favor, intenta nuevamente.')
        setIsCreatingSubscription(false)
        return
      }

      const userData = await userResponse.json()
      const email = userData.user?.email

      if (!email) {
        setSubscriptionError('No se pudo obtener el email del usuario')
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
        // Suscripción creada exitosamente, completar el registro
        updateData({ paymentMethod: 'mercadopago' })
        setTimeout(() => {
          onSubmit()
        }, 1000)
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
        {/* Payment Info Banner */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 glass">
          <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <CreditCard className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              Configura tu suscripción
            </h3>
            <p className="text-white/80 mb-3">
              Puedes comenzar sin pago y configurar tu suscripción más adelante, 
              o configurar tu método de pago ahora con MercadoPago.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                Acceso completo a todas las funcionalidades
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                Pago seguro con MercadoPago
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
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
                Comenzar sin pago
              </p>
              <p className="text-sm text-white/70">
                Configura tu suscripción más adelante desde el dashboard
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
                $15 ARS/mes - Pago recurrente cada 30 días (Modo prueba)
              </p>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
              Disponible
            </div>
          </div>
          
          {!skipPayment && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <CardPaymentForm
                publicKey={MP_PUBLIC_KEY}
                onTokenCreated={handleCardTokenCreated}
                onError={setSubscriptionError}
                isLoading={isCreatingSubscription}
              />
            </div>
          )}
        </div>
      </div>

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
