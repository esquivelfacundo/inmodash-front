'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { CreditCard, Lock } from 'lucide-react'

declare global {
  interface Window {
    MercadoPago: any
  }
}

interface CardPaymentFormProps {
  publicKey: string
  onTokenCreated: (token: string) => void
  onError: (error: string) => void
  isLoading?: boolean
}

export function CardPaymentForm({ publicKey, onTokenCreated, onError, isLoading }: CardPaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [securityCode, setSecurityCode] = useState('')
  const [docNumber, setDocNumber] = useState('')
  const [sdkLoaded, setSdkLoaded] = useState(false)

  useEffect(() => {
    // Check if SDK is already loaded
    if (window.MercadoPago) {
      setSdkLoaded(true)
    }
  }, [])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cardNumber || !cardholderName || !expirationDate || !securityCode || !docNumber) {
      onError('Por favor completa todos los campos')
      return
    }

    if (!window.MercadoPago) {
      onError('SDK de MercadoPago no está cargado. Por favor recarga la página.')
      return
    }

    try {
      // Inicializar MercadoPago
      const mp = new window.MercadoPago(publicKey)

      // Separar mes y año
      const [month, year] = expirationDate.split('/')

      // Crear el token de la tarjeta
      const cardData = {
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardholderName,
        cardExpirationMonth: month,
        cardExpirationYear: `20${year}`,
        securityCode,
        identificationType: 'DNI',
        identificationNumber: docNumber,
      }

      const token = await mp.createCardToken(cardData)

      if (token.id) {
        onTokenCreated(token.id)
      } else {
        onError('Error al crear el token de la tarjeta')
      }
    } catch (error) {
      console.error('Error creating card token:', error)
      onError('Error al procesar la tarjeta. Verifica los datos.')
    }
  }

  return (
    <>
      <Script 
        src="https://sdk.mercadopago.com/js/v2" 
        strategy="lazyOnload"
        onLoad={() => setSdkLoaded(true)}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-white/70" />
          <p className="text-sm text-white/70">
            Pago seguro y encriptado
          </p>
        </div>

      {/* Número de tarjeta */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Número de Tarjeta
        </label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent pl-12 text-white"
            disabled={isLoading}
          />
          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
        </div>
      </div>

      {/* Nombre del titular */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Nombre del Titular
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
          placeholder="JUAN PEREZ"
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Fecha de vencimiento */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Vencimiento
          </label>
          <input
            type="text"
            value={expirationDate}
            onChange={(e) => setExpirationDate(formatExpirationDate(e.target.value))}
            placeholder="MM/AA"
            maxLength={5}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
            disabled={isLoading}
          />
        </div>

        {/* CVV */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="123"
            maxLength={4}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* DNI */}
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          DNI
        </label>
        <input
          type="text"
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="12345678"
          maxLength={8}
          className="w-full px-4 py-3 bg-slate-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Procesando...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Confirmar Suscripción
          </>
        )}
      </button>
    </form>
    </>
  )
}
