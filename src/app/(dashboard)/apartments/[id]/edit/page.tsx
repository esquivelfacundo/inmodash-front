'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ApartmentForm } from '@/components/forms/apartment-form'
import { useApartment } from '@/hooks/useApartments'
import { useBuildings } from '@/hooks/useBuildings'
import { Loading } from '@/components/ui/loading'
import { getPropertyLabel } from '@/lib/property-labels'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditApartmentPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const apartmentId = Number(resolvedParams.id)
  
  const { apartment, loading: apartmentLoading } = useApartment(apartmentId)
  const { buildings, loading: buildingsLoading } = useBuildings()

  const loading = apartmentLoading || buildingsLoading
  const propertyLabel = apartment ? getPropertyLabel(apartment.propertyType) : 'Propiedad'

  if (loading) {
    return <Loading size="lg" text={`Cargando ${propertyLabel.toLowerCase()}...`} />
  }

  if (!apartment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-white/90 mb-2">Propiedad no encontrada</h2>
        <Link href="/apartments">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Unidades
          </Button>
        </Link>
      </div>
    )
  }

  const handleSuccess = async (apartmentId: string) => {
    router.push(`/apartments/${apartmentId}`)
  }

  const handleCancel = () => {
    router.push(`/apartments/${apartment.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/apartments/${apartment.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar {propertyLabel}</h1>
          <p className="text-white/60 mt-2">
            Modifica la información de {propertyLabel.toLowerCase()} {apartment.nomenclature}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <ApartmentForm
          buildings={buildings}
          selectedBuildingId={String(apartment.buildingId)}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          initialData={{
            buildingId: String(apartment.buildingId),
            floor: apartment.floor,
            apartmentLetter: apartment.apartmentLetter,
            area: apartment.area,
            rooms: apartment.rooms,
            status: apartment.status,
            saleStatus: apartment.saleStatus,
            nomenclature: apartment.nomenclature,
            propertyType: apartment.propertyType,
            specifications: apartment.specifications,
          }}
          isEditing={true}
          apartmentId={apartmentId}
        />
      </div>
    </div>
  )
}
