'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Building2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TenantForm } from '@/components/forms/tenant-form'
import type { TenantFormData } from '@/components/forms/tenant-form'
import { useApartment } from '@/hooks/useApartments'
import { tenantsService } from '@/services'
import { Loading } from '@/components/ui/loading'
import { logger } from '@/lib/logger'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function NewTenantPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { apartment, loading: apartmentLoading } = useApartment(Number(resolvedParams.id))
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: TenantFormData) => {
    setIsLoading(true)
    
    try {
      // Create tenant with contact person
      const tenant = await tenantsService.create({
        nameOrBusiness: data.nameOrBusiness,
        dniOrCuit: data.dniOrCuit,
        address: data.address,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        contactAddress: data.contactAddress
      })

      // Redirect to contract creation page
      router.push(`/apartments/${resolvedParams.id}/tenants/${tenant.id}/contract/new`)
    } catch (error) {
      logger.error('Error creating tenant', error)
      alert('Error al crear el cliente. Por favor intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/apartments/${resolvedParams.id}`)
  }

  if (apartmentLoading) {
    return <Loading size="lg" text="Cargando departamento..." />
  }

  if (!apartment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-white/60">Departamento no encontrado</p>
          <Link href="/buildings">
            <Button className="mt-4" variant="outline">
              Volver a Edificios
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Link href="/buildings" className="hover:text-white">
              Edificios
            </Link>
            <span>/</span>
            <Link
              href={`/buildings/${apartment.buildingId}`}
              className="hover:text-white"
            >
              {apartment.building?.name}
            </Link>
            <span>/</span>
            <Link
              href={`/apartments/${apartment.id}`}
              className="hover:text-white"
            >
              {apartment.nomenclature}
            </Link>
            <span>/</span>
            <span className="text-white">Nuevo Cliente</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Crear Nuevo Cliente</h1>
          <p className="text-white/60">
            Registra un nuevo inquilino para {apartment.building?.name} - {apartment.nomenclature}
          </p>
        </div>
        <Link href={`/apartments/${apartment.id}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      {/* Apartment Info Card */}
      <div className="bg-blue-50 border-none border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {apartment.building?.name} - {apartment.nomenclature}
            </h3>
            <p className="text-sm text-white/60">
              ID: {apartment.uniqueId} • Piso {apartment.floor} • {apartment.area} m² • {apartment.rooms} ambientes
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <TenantForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />

      {/* Info Note */}
      <div className="bg-slate-800/30 border -200 rounded-lg p-4">
        <p className="text-sm text-white/60">
          <strong>Nota:</strong> Después de crear el cliente, podrás agregar documentación (DNI, recibo de sueldo, etc.) 
          y crear el contrato de locación con los garantes correspondientes.
        </p>
      </div>
    </div>
  )
}
