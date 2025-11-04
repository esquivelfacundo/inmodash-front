'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, Building2, User, MapPin, Phone, Mail, Globe, CheckCircle2, Sparkles } from 'lucide-react'
import { RegistrationData } from '../multi-step-register'
import { TermsModal } from '@/components/legal/terms-modal'
import { PrivacyModal } from '@/components/legal/privacy-modal'

interface SummaryStepProps {
  data: RegistrationData
  onNext: () => void
  onBack: () => void
}

export function SummaryStep({ data, onNext, onBack }: SummaryStepProps) {
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  
  const features = [
    'Gestión ilimitada de propiedades',
    'Control de contratos y pagos',
    'Dashboard con estadísticas en tiempo real',
    'Gestión de clientes y propietarios',
    'Sistema de documentos',
    'Reportes y análisis',
    'Soporte técnico prioritario',
    'Actualizaciones automáticas',
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Datos del Representante */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Representante</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-white/60">Nombre</p>
              <p className="font-medium text-white">{data.name}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Email</p>
              <p className="font-medium text-white">{data.email}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Teléfono</p>
              <p className="font-medium text-white">{data.phone}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Cargo</p>
              <p className="font-medium text-white">{data.position}</p>
            </div>
          </div>
        </div>

        {/* Datos de la Empresa */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Empresa</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-white/70">Nombre</p>
              <p className="font-medium text-white">{data.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">CUIT/RUT</p>
              <p className="font-medium text-white">{data.companyTaxId}</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Dirección</p>
              <p className="font-medium text-white">
                {data.companyAddress}, {data.companyCity}, {data.companyState}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70">Teléfono</p>
              <p className="font-medium text-white">{data.companyPhone}</p>
            </div>
            {data.companyWebsite && (
              <div>
                <p className="text-sm text-white/70">Sitio Web</p>
                <p className="font-medium text-white">{data.companyWebsite}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan de Suscripción */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Plan Professional</h3>
            </div>
            <p className="text-white/70">
              Todo lo que necesitas para gestionar tu inmobiliaria
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70">Precio mensual</p>
            <p className="text-4xl font-bold text-green-400">$289</p>
            <p className="text-sm text-white/60">USD/mes</p>
          </div>
        </div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-white/90">{feature}</span>
            </div>
          ))}
        </div>

        {/* Trial Info */}
        <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-white">
                🎉 ¡Prueba gratis por 30 días!
              </p>
              <p className="text-sm text-white/70">
                Sin compromiso. Cancela cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Términos y Condiciones */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-1 h-5 w-5 bg-slate-700 text-cyan-400 border-white/20 rounded focus:ring-cyan-500"
          />
          <span className="text-sm text-white/90">
            Acepto los{' '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setShowTerms(true)
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium underline"
            >
              Términos y Condiciones
            </button>{' '}
            y la{' '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setShowPrivacy(true)
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium underline"
            >
              Política de Privacidad
            </button>
          </span>
        </label>
      </div>

      {/* Modales */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  )
}
