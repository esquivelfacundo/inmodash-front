'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BuildingForm } from '@/components/forms/building-form'
import { useBuilding } from '@/hooks/useBuildings'
import { Loading } from '@/components/ui/loading'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditBuildingPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const buildingId = Number(resolvedParams.id)
  
  const { building, loading } = useBuilding(buildingId)

  if (loading) {
    return <Loading size="lg" text="Cargando edificio..." />
  }

  if (!building) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-white/90 mb-2">Edificio no encontrado</h2>
        <Link href="/buildings">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Edificios
          </Button>
        </Link>
      </div>
    )
  }

  const handleSuccess = (buildingId: number) => {
    router.push(`/buildings/${buildingId}`)
  }

  const handleCancel = () => {
    router.push(`/buildings/${building.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/buildings/${building.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar Edificio</h1>
          <p className="text-white/60 mt-2">
            Modifica la información del edificio {building.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <BuildingForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          initialData={{
            name: building.name,
            address: building.address,
            city: building.city,
            province: building.province,
            owner: building.owner,
            floors: building.floors,
            totalArea: building.totalArea,
            floorConfiguration: building.floorConfiguration || [],
          }}
          isEditing={true}
          buildingId={buildingId}
        />
      </div>
    </div>
  )
}
