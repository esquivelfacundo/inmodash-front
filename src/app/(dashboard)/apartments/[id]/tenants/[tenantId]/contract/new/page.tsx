'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, UserPlus, Plus, Building2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GuarantorForm } from '@/components/forms/guarantor-form'
import type { GuarantorFormData } from '@/components/forms/guarantor-form'
import { ContractForm } from '@/components/forms/contract-form'
import type { ContractFormData } from '@/components/forms/contract-form'
import { useApartment } from '@/hooks/useApartments'
import { useTenant } from '@/hooks/useTenants'
import { useGuarantorsByTenant } from '@/hooks/useGuarantors'
import { useContracts } from '@/hooks/useContracts'
import { Loading } from '@/components/ui/loading'
import { logger } from '@/lib/logger'

interface PageProps {
  params: Promise<{ id: string; tenantId: string }>
}

export default function NewContractPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  
  const { apartment, loading: apartmentLoading } = useApartment(Number(resolvedParams.id))
  const { tenant, loading: tenantLoading } = useTenant(Number(resolvedParams.tenantId))
  const { guarantors, createGuarantor, refresh: refreshGuarantors } = useGuarantorsByTenant(Number(resolvedParams.tenantId))
  const { createContract } = useContracts()
  
  const [showGuarantorForm, setShowGuarantorForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loading = apartmentLoading || tenantLoading

  if (loading) {
    return <Loading size="lg" text="Cargando información..." />
  }

  const handleGuarantorSubmit = async (data: GuarantorFormData) => {
    if (!tenant) return
    
    setIsLoading(true)
    
    try {
      await createGuarantor(data)
      await refreshGuarantors()
      setShowGuarantorForm(false)
    } catch (error) {
      logger.error('Error creating guarantor:', error)
      alert('Error al crear el garante. Por favor intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleContractSubmit = async (data: ContractFormData) => {
    if (!apartment || !tenant) return
    
    setIsLoading(true)
    
    try {
      // Create contract with API
      await createContract({
        apartmentId: Number(apartment.id),
        tenantId: Number(tenant.id),
        guarantorIds: data.guarantorIds.map(Number),
        startDate: data.startDate,
        endDate: data.endDate,
        initialAmount: data.initialAmount,
        updateRule: {
          updateFrequency: data.updateFrequency,
          monthlyCoefficient: data.monthlyCoefficient,
          lateInterest: data.lateInterestPercent && data.lateInterestFrequency ? {
            percent: data.lateInterestPercent,
            frequency: data.lateInterestFrequency
          } : undefined,
          updatePeriods: data.updatePeriods.map((period: any) => ({
            date: period.date,
            type: period.type,
            value: period.value,
            indexName: period.indexName,
          }))
        }
      })

      // Redirect to apartment profile
      router.push(`/apartments/${apartment.id}`)
    } catch (error) {
      logger.error('Error creating contract:', error)
      alert('Error al crear el contrato. Por favor intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/apartments/${resolvedParams.id}`)
  }

  if (!apartment || !tenant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-white/60">Información no encontrada</p>
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
            <span className="text-white">Nuevo Contrato</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Crear Contrato de Locación</h1>
          <p className="text-white/60">
            Contrato para {tenant.nameOrBusiness}
          </p>
        </div>
        <Link href={`/apartments/${apartment.id}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Apartment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-semibold">{apartment.building?.name} - {apartment.nomenclature}</p>
              <p className="text-sm text-white/60">ID: {apartment.uniqueId}</p>
              <p className="text-sm text-white/60">
                Piso {apartment.floor} • {apartment.area} m² • {apartment.rooms} ambientes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Inquilino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-semibold">{tenant.nameOrBusiness}</p>
              <p className="text-sm text-white/60">DNI/CUIT: {tenant.dniOrCuit}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guarantors Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Garantes Disponibles</CardTitle>
              <CardDescription>
                {guarantors.length === 0 
                  ? 'No hay garantes registrados. Agrega al menos uno para continuar.'
                  : `${guarantors.length} garante(s) disponible(s)`}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGuarantorForm(!showGuarantorForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showGuarantorForm ? 'Cancelar' : 'Agregar Garante'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showGuarantorForm ? (
            <GuarantorForm
              onSubmit={handleGuarantorSubmit}
              onCancel={() => setShowGuarantorForm(false)}
              isLoading={isLoading}
            />
          ) : (
            <div className="space-y-2">
              {guarantors.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay garantes registrados
                </p>
              ) : (
                guarantors.map((guarantor) => (
                  <div
                    key={guarantor.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{guarantor.name}</p>
                      <p className="text-sm text-white/60">DNI: {guarantor.dni}</p>
                    </div>
                    <div className="text-sm text-white/60">
                      {guarantor.phone}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contract Form */}
      {!showGuarantorForm && guarantors.length > 0 && (
        <ContractForm
          onSubmit={handleContractSubmit}
          onCancel={handleCancel}
          availableGuarantors={guarantors.map(g => ({ id: String(g.id), name: g.name }))}
          isLoading={isLoading}
        />
      )}

      {/* Warning if no guarantors */}
      {!showGuarantorForm && guarantors.length === 0 && (
        <div className="bg-yellow-50 border-none border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Atención:</strong> Debes agregar al menos un garante antes de crear el contrato.
          </p>
        </div>
      )}
    </div>
  )
}
