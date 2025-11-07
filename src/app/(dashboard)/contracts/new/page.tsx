'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Search, Plus, X, DollarSign, TrendingUp, Building2, Home, User, Calendar } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { useTenants } from '@/hooks/useTenants'
import { useApartments } from '@/hooks/useApartments'
import { useBuildings } from '@/hooks/useBuildings'
import { useGuarantors } from '@/hooks/useGuarantors'
import { useContracts } from '@/hooks/useContracts'
import { ApartmentStatus } from '@/types'

interface ContractCost {
  id: string
  concept: string
  amount: number
  isProfit: boolean
}

const STEPS = [
  { id: 1, name: 'Cliente', icon: User },
  { id: 2, name: 'Unidad', icon: Home },
  { id: 3, name: 'Contrato', icon: Calendar },
  { id: 4, name: 'Costos', icon: DollarSign },
]

export default function NewContractPage() {
  const router = useRouter()
  const { tenants, loading: tenantsLoading } = useTenants()
  const { apartments, loading: apartmentsLoading } = useApartments()
  const { buildings, loading: buildingsLoading } = useBuildings()
  const { guarantors, loading: guarantorsLoading } = useGuarantors()
  const { createContract } = useContracts()

  const [currentStep, setCurrentStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null)
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | null>(null)
  const [selectedGuarantorIds, setSelectedGuarantorIds] = useState<number[]>([])
  const [contractData, setContractData] = useState({
    startDate: '',
    endDate: '',
    initialAmount: '',
    updateFrequency: 'MONTHLY',
    monthlyCoefficient: '1.05',
  })
  const [costs, setCosts] = useState<ContractCost[]>([])
  const [newCost, setNewCost] = useState({
    concept: '',
    amount: '',
    isProfit: true,
  })
  const [submitting, setSubmitting] = useState(false)

  const loading = tenantsLoading || apartmentsLoading || buildingsLoading || guarantorsLoading

  // Filter tenants by search
  const filteredTenants = useMemo(() => {
    if (!searchTerm) return tenants
    const term = searchTerm.toLowerCase()
    return tenants.filter(
      (t) =>
        t.nameOrBusiness.toLowerCase().includes(term) ||
        t.dniOrCuit.toLowerCase().includes(term) ||
        t.contactEmail.toLowerCase().includes(term)
    )
  }, [tenants, searchTerm])

  // Filter available apartments
  const availableApartments = useMemo(() => {
    return apartments.filter((apt) => apt.status === ApartmentStatus.AVAILABLE)
  }, [apartments])

  // Get building name
  const getBuildingName = (buildingId: number | null | undefined) => {
    if (!buildingId) return 'Propiedad Independiente'
    const building = buildings.find((b) => b.id === buildingId)
    return building?.name || 'Edificio desconocido'
  }

  // Filter guarantors for selected tenant
  const availableGuarantors = useMemo(() => {
    if (!selectedTenantId) return []
    return guarantors.filter((g) => g.tenantId === selectedTenantId)
  }, [guarantors, selectedTenantId])

  // Add cost
  const handleAddCost = () => {
    if (!newCost.concept || !newCost.amount) return

    const cost: ContractCost = {
      id: Date.now().toString(),
      concept: newCost.concept,
      amount: parseFloat(newCost.amount),
      isProfit: newCost.isProfit,
    }

    setCosts([...costs, cost])
    setNewCost({ concept: '', amount: '', isProfit: true })
  }

  // Remove cost
  const handleRemoveCost = (id: string) => {
    setCosts(costs.filter((c) => c.id !== id))
  }

  // Calculate totals
  const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0)
  const totalProfits = costs.filter((c) => c.isProfit).reduce((sum, cost) => sum + cost.amount, 0)

  // Toggle guarantor selection
  const toggleGuarantor = (guarantorId: number) => {
    setSelectedGuarantorIds((prev) =>
      prev.includes(guarantorId) ? prev.filter((id) => id !== guarantorId) : [...prev, guarantorId]
    )
  }

  // Validate step
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTenantId !== null
      case 2:
        return selectedApartmentId !== null
      case 3:
        return contractData.startDate && contractData.endDate && contractData.initialAmount
      case 4:
        return true // Costs are optional
      default:
        return false
    }
  }

  // Submit contract
  const handleSubmit = async () => {
    if (!selectedTenantId || !selectedApartmentId) return

    setSubmitting(true)
    try {
      const contractPayload = {
        apartmentId: selectedApartmentId,
        tenantId: selectedTenantId,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        initialAmount: parseFloat(contractData.initialAmount),
        guarantorIds: selectedGuarantorIds,
        updateRule: {
          updateFrequency: contractData.updateFrequency,
          monthlyCoefficient: parseFloat(contractData.monthlyCoefficient),
          updatePeriods: [],
        },
        // TODO: Add costs to the contract payload when backend is ready
        costs: costs,
      }

      await createContract(contractPayload as any)
      router.push('/contracts')
    } catch (error) {
      console.error('Error creating contract:', error)
      alert('Error al crear el contrato. Por favor intente nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loading size="lg" text="Cargando datos..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/contracts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Nuevo Contrato</h1>
            <p className="text-white/60 mt-2">Crea un nuevo contrato de alquiler paso a paso</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-300'
                      : isActive
                      ? 'bg-blue-500/20 text-blue-300 ring-2 ring-blue-500'
                      : 'bg-white/5 text-white/40'
                  }`}
                >
                  {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                </div>
                <p
                  className={`text-sm mt-2 ${
                    isActive ? 'text-white font-medium' : isCompleted ? 'text-green-300' : 'text-white/60'
                  }`}
                >
                  {step.name}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-500/50' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <GlassCard>
        <GlassCardContent className="p-6">
          {/* Step 1: Select Tenant */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Seleccionar Cliente</h2>
                <p className="text-white/60">Busca un cliente existente o crea uno nuevo</p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, DNI/CUIT o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>

              {/* Create New Tenant Button */}
              <Button
                variant="outline"
                className="w-full bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20"
                onClick={() => router.push('/clients/new?returnTo=/contracts/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Nuevo Cliente
              </Button>

              {/* Tenant List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    onClick={() => setSelectedTenantId(tenant.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedTenantId === tenant.id
                        ? 'bg-blue-500/20 border-2 border-blue-500'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{tenant.nameOrBusiness}</p>
                        <p className="text-sm text-white/60">DNI/CUIT: {tenant.dniOrCuit}</p>
                        <p className="text-sm text-white/60">{tenant.contactEmail}</p>
                      </div>
                      {selectedTenantId === tenant.id && (
                        <Check className="h-6 w-6 text-blue-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Apartment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Seleccionar Unidad</h2>
                <p className="text-white/60">Elige la unidad que se alquilará</p>
              </div>

              {availableApartments.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">No hay unidades disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableApartments.map((apartment) => (
                    <div
                      key={apartment.id}
                      onClick={() => setSelectedApartmentId(apartment.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedApartmentId === apartment.id
                          ? 'bg-blue-500/20 border-2 border-blue-500'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-500/20 text-green-300">Disponible</Badge>
                          {selectedApartmentId === apartment.id && (
                            <Check className="h-5 w-5 text-blue-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-white/60" />
                          <p className="font-medium text-white">
                            {getBuildingName(apartment.buildingId)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-white/60" />
                          <p className="text-white/80">Unidad: {apartment.nomenclature}</p>
                        </div>
                        <p className="text-sm text-white/60">
                          {apartment.rooms} ambientes • {apartment.area}m²
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Contract Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Datos del Contrato</h2>
                <p className="text-white/60">Completa la información del contrato</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={contractData.startDate}
                    onChange={(e) =>
                      setContractData({ ...contractData, startDate: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Finalización</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={contractData.endDate}
                    onChange={(e) =>
                      setContractData({ ...contractData, endDate: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialAmount">Monto Inicial</Label>
                  <Input
                    id="initialAmount"
                    type="number"
                    placeholder="0"
                    value={contractData.initialAmount}
                    onChange={(e) =>
                      setContractData({ ...contractData, initialAmount: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyCoefficient">Coeficiente Mensual</Label>
                  <Input
                    id="monthlyCoefficient"
                    type="number"
                    step="0.01"
                    value={contractData.monthlyCoefficient}
                    onChange={(e) =>
                      setContractData({ ...contractData, monthlyCoefficient: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Guarantors */}
              <div className="space-y-4">
                <Label>Garantes (Opcional)</Label>
                {availableGuarantors.length === 0 ? (
                  <p className="text-sm text-white/60">
                    No hay garantes registrados para este cliente
                  </p>
                ) : (
                  <div className="space-y-2">
                    {availableGuarantors.map((guarantor) => (
                      <div
                        key={guarantor.id}
                        onClick={() => toggleGuarantor(guarantor.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedGuarantorIds.includes(guarantor.id)
                            ? 'bg-blue-500/20 border border-blue-500'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white">{guarantor.name}</p>
                            <p className="text-sm text-white/60">DNI: {guarantor.dni}</p>
                          </div>
                          {selectedGuarantorIds.includes(guarantor.id) && (
                            <Check className="h-5 w-5 text-blue-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Costs */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Costos del Contrato</h2>
                <p className="text-white/60">
                  Agrega los costos asociados al contrato y define cuáles son ganancias
                </p>
              </div>

              {/* Add Cost Form */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="concept">Concepto</Label>
                    <Input
                      id="concept"
                      type="text"
                      placeholder="Ej: Comisión, Escribanía..."
                      value={newCost.concept}
                      onChange={(e) => setNewCost({ ...newCost, concept: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Costo</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={newCost.amount}
                      onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={newCost.isProfit ? 'default' : 'outline'}
                        className={`flex-1 ${
                          newCost.isProfit
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => setNewCost({ ...newCost, isProfit: true })}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Ganancia
                      </Button>
                      <Button
                        type="button"
                        variant={!newCost.isProfit ? 'default' : 'outline'}
                        className={`flex-1 ${
                          !newCost.isProfit
                            ? 'bg-gray-600 hover:bg-gray-700'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => setNewCost({ ...newCost, isProfit: false })}
                      >
                        Externo
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddCost}
                  disabled={!newCost.concept || !newCost.amount}
                  className="w-full bg-blue-500/20 hover:bg-blue-500/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Costo
                </Button>
              </div>

              {/* Costs List */}
              {costs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-white">Costos Agregados</h3>
                  <div className="space-y-2">
                    {costs.map((cost) => (
                      <div
                        key={cost.id}
                        className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium text-white">{cost.concept}</p>
                            <Badge
                              className={
                                cost.isProfit
                                  ? 'bg-green-500/20 text-green-300'
                                  : 'bg-gray-500/20 text-gray-300'
                              }
                            >
                              {cost.isProfit ? 'Ganancia' : 'Externo'}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-white mt-1">
                            ${cost.amount.toLocaleString('es-AR')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCost(cost.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-2">
                    <div className="flex justify-between text-white/80">
                      <span>Total Costos:</span>
                      <span className="font-bold">${totalCosts.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between text-green-300">
                      <span>Total Ganancias:</span>
                      <span className="font-bold">${totalProfits.toLocaleString('es-AR')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCardContent>
      </GlassCard>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        {currentStep < STEPS.length ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || submitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {submitting ? (
              <>
                <Loading size="sm" />
                <span className="ml-2">Creando...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Crear Contrato
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
