'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Building2, User, FileText, CreditCard, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RepresentativeStep } from './steps/representative-step'
import { CompanyStep } from './steps/company-step'
import { SummaryStep } from './steps/summary-step'
import { PaymentStep } from './steps/payment-step'

export interface RegistrationData {
  // Datos del representante
  name: string
  email: string
  password: string
  phone: string
  position: string
  
  // Datos de la inmobiliaria
  companyName: string
  companyTaxId: string
  companyAddress: string
  companyCity: string
  companyState: string
  companyCountry: string
  companyZipCode: string
  companyPhone: string
  companyWebsite: string
  
  // Datos de pago (opcionales por ahora)
  paymentMethod?: string
  cardNumber?: string
  cardHolder?: string
  cardExpiry?: string
  cardCvv?: string
}

const steps = [
  {
    id: 1,
    title: 'Representante',
    description: 'Datos personales',
    headerTitle: 'Datos del Representante',
    headerDescription: 'Información personal del responsable',
    icon: User,
  },
  {
    id: 2,
    title: 'Empresa',
    description: 'Tu empresa',
    headerTitle: 'Datos de la Empresa',
    headerDescription: 'Información de tu empresa inmobiliaria',
    icon: Building2,
  },
  {
    id: 3,
    title: 'Resumen',
    description: 'Confirmación',
    headerTitle: 'Resumen de tu Registro',
    headerDescription: 'Verifica que toda la información sea correcta',
    icon: FileText,
  },
  {
    id: 4,
    title: 'Pago',
    description: 'Suscripción',
    headerTitle: 'Método de Pago',
    headerDescription: 'Configura tu método de pago para continuar',
    icon: CreditCard,
  },
]

export function MultiStepRegister() {
  const router = useRouter()
  const { register: registerUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<RegistrationData>>({})
  const [formSubmitTrigger, setFormSubmitTrigger] = useState(0)

  const updateFormData = (data: Partial<RegistrationData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const triggerFormSubmit = () => {
    setFormSubmitTrigger(prev => prev + 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      console.log('🔥 MULTI-STEP REGISTER - Using useAuth hook')
      
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Faltan datos requeridos')
      }

      const success = await registerUser(formData.name, formData.email, formData.password)
      
      if (success) {
        console.log('🔥 Registration successful via useAuth')
        alert('¡Registro exitoso! Bienvenido a InmoDash')
        // Redirigir al dashboard ya que el usuario está autenticado
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        throw new Error('Error al registrar usuario')
      }
    } catch (error) {
      console.error('🔥 Registration error:', error)
      alert(error instanceof Error ? error.message : 'Error al registrar')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RepresentativeStep
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            submitTrigger={formSubmitTrigger}
          />
        )
      case 2:
        return (
          <CompanyStep
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
            submitTrigger={formSubmitTrigger}
          />
        )
      case 3:
        return (
          <SummaryStep
            data={formData as RegistrationData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
        return (
          <PaymentStep
            data={formData}
            updateData={updateFormData}
            onSubmit={handleSubmit}
            onBack={prevStep}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 h-screen">
        <div className="h-full flex flex-col py-8 px-6">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">InmoDash</h1>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-full shadow-sm">
                    Premium
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Steps Navigation */}
          <nav className="flex-1 space-y-2">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive && 'text-white bg-white/10 backdrop-blur-sm',
                    isCompleted && 'text-green-400 bg-green-500/10',
                    !isActive && !isCompleted && 'text-white/60'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    isActive && 'bg-blue-500/20',
                    isCompleted && 'bg-green-500/20',
                    !isActive && !isCompleted && 'bg-white/5'
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-xs text-white/50">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* Footer Info */}
          <div className="mt-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <p className="text-xs text-white/60 mb-3 text-center">
                ¿Ya tienes una cuenta?
              </p>
              <a
                href="/login"
                className="block text-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-all"
              >
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen p-8 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Form Content Container - Ocupa todo el espacio disponible */}
          <div className="h-full bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col">
            {/* Top Bar - Header */}
            <div className="flex-shrink-0 bg-white/5 backdrop-blur-sm px-8 py-6 rounded-t-3xl">
              <h2 className="text-3xl font-bold text-white mb-2">
                {steps[currentStep - 1].headerTitle}
              </h2>
              <p className="text-white/70">
                {steps[currentStep - 1].headerDescription}
              </p>
            </div>

            {/* Scroll Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8 min-h-0 glass-scrollbar">
              {renderStep()}
            </div>

            {/* Bottom Action Bar */}
            <div className="flex-shrink-0 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-b-3xl">
              <div className="flex justify-between items-center">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all font-medium"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Atrás
                  </button>
                ) : (
                  <div />
                )}
                
                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1 || currentStep === 2) {
                        triggerFormSubmit()
                      } else {
                        nextStep()
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-lg hover:shadow-xl"
                  >
                    Siguiente
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Registrando...' : 'Completar Registro'}
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
