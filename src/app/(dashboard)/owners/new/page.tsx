'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OwnerForm } from '@/components/forms/owner-form'

export default function NewOwnerPage() {
  const router = useRouter()

  const handleSuccess = (ownerId: number) => {
    router.push(`/owners/${ownerId}`)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Nuevo Propietario</h1>
          <p className="text-white/60 mt-1">
            Registra un nuevo propietario de propiedades
          </p>
        </div>
      </div>

      {/* Form */}
      <OwnerForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
