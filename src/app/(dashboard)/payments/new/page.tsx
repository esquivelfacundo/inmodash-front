'use client'

import { useRouter } from 'next/navigation'
import { PaymentForm } from '@/components/forms/payment-form'
import { Card } from '@/components/ui/card'

export default function NewPaymentPage() {
  const router = useRouter()

  const handleSuccess = (paymentId: number) => {
    router.push('/payments')
  }

  const handleCancel = () => {
    router.push('/payments')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Registrar Nuevo Pago</h1>
        <p className="text-white/60 mt-2">
          Complete el formulario para registrar un nuevo pago de alquiler
        </p>
      </div>

      <PaymentForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
