'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BuildingForm } from '@/components/forms/building-form'
import Link from 'next/link'

export default function NewBuildingPage() {
  const router = useRouter()

  const handleSuccess = (buildingId: number) => {
    router.push(`/buildings/${buildingId}`)
  }

  const handleCancel = () => {
    router.push('/buildings')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/buildings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Nuevo Edificio</h1>
          <p className="text-white/60 mt-2">
            Crea un nuevo edificio y configura sus departamentos
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <BuildingForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
