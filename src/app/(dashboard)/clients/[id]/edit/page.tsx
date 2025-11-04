'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TenantForm } from '@/components/forms/tenant-form'
import type { TenantFormData } from '@/components/forms/tenant-form'
import { useTenant } from '@/hooks/useTenants'
import { tenantsService } from '@/services'
import { Loading } from '@/components/ui/loading'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditClientPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const tenantId = Number(resolvedParams.id)
  
  const { tenant, loading } = useTenant(tenantId)

  if (loading) {
    return <Loading size="lg" text="Cargando cliente..." />
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-white/90 mb-2">Cliente no encontrado</h2>
        <Link href="/clients">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Clientes
          </Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (data: TenantFormData) => {
    try {
      await tenantsService.update(tenantId, {
        nameOrBusiness: data.nameOrBusiness,
        dniOrCuit: data.dniOrCuit,
        address: data.address,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        contactAddress: data.contactAddress,
      })
      router.push('/clients')
    } catch {
      alert('Error al actualizar el cliente. Por favor intente nuevamente.')
    }
  }

  const handleCancel = () => {
    router.push('/clients')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/clients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar Cliente</h1>
          <p className="text-white/60 mt-2">
            Modifica la información del cliente {tenant.nameOrBusiness}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <TenantForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={{
            nameOrBusiness: tenant.nameOrBusiness,
            dniOrCuit: tenant.dniOrCuit,
            address: tenant.address,
            contactName: tenant.contactName,
            contactPhone: tenant.contactPhone,
            contactEmail: tenant.contactEmail,
            contactAddress: tenant.contactAddress,
          }}
          isLoading={false}
        />
      </div>
    </div>
  )
}
