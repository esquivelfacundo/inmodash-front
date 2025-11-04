'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home, Building2, Save, MapPin, Plus, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useBuildings } from '@/hooks/useBuildings'
import { useOwners } from '@/hooks/useOwners'
import { ApartmentStatus, SaleStatus } from '@/types'
import { apartmentsService, buildingsService, ownersService } from '@/services'
import { PropertySpecifications } from '@/components/property/PropertySpecifications'
import { getDefaultSpecifications } from '@/config/property-specifications'
import { getPropertyLabel, canBeInBuilding } from '@/lib/property-labels'

export default function NewApartmentPage() {
  const router = useRouter()
  const { buildings, refresh: refreshBuildings } = useBuildings()
  const { owners, refresh: refreshOwners } = useOwners()
  const [loading, setLoading] = useState(false)
  const [propertyType, setPropertyType] = useState('departamento')
  const [isIndependent, setIsIndependent] = useState(true)
  const [showNewBuildingForm, setShowNewBuildingForm] = useState(false)
  const [showNewOwnerForm, setShowNewOwnerForm] = useState(false)
  const [specifications, setSpecifications] = useState<Record<string, any>>(
    getDefaultSpecifications('departamento')
  )

  const [formData, setFormData] = useState({
    // Datos del edificio (si aplica)
    buildingId: '',
    floor: '',
    apartmentLetter: '',
    
    // Datos para departamento independiente
    fullAddress: '',
    city: '',
    province: '',
    
    // Datos comunes
    nomenclature: '',
    area: '',
    rooms: '',
    status: ApartmentStatus.AVAILABLE,
    saleStatus: SaleStatus.NOT_FOR_SALE,
    ownerId: '',
  })

  const [newBuilding, setNewBuilding] = useState({
    name: '',
    address: '',
    city: '',
    province: '',
    owner: '',
    floors: '',
    totalArea: '',
  })

  const [newOwner, setNewOwner] = useState({
    name: '',
    dniOrCuit: '',
    phone: '',
    email: '',
    address: '',
    bankAccount: '',
    commissionPercentage: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateBuilding = async () => {
    try {
      const floors = parseInt(newBuilding.floors) || 1
      // Crear configuración básica de pisos (1 departamento por piso por defecto)
      const floorConfiguration = Array.from({ length: floors }, (_, i) => ({
        floor: i + 1,
        apartmentsCount: 1,
      }))

      const building = await buildingsService.create({
        name: newBuilding.name,
        address: newBuilding.address,
        city: newBuilding.city,
        province: newBuilding.province,
        owner: newBuilding.owner,
        floors: floors,
        totalArea: parseFloat(newBuilding.totalArea) || 0,
        floorConfiguration,
      })
      await refreshBuildings()
      setFormData(prev => ({ ...prev, buildingId: String(building.id) }))
      setShowNewBuildingForm(false)
      setNewBuilding({
        name: '',
        address: '',
        city: '',
        province: '',
        owner: '',
        floors: '',
        totalArea: '',
      })
    } catch (error) {
      console.error('Error creating building:', error)
      alert('Error al crear el edificio')
    }
  }

  const handleCreateOwner = async () => {
    try {
      const owner = await ownersService.create({
        name: newOwner.name,
        dniOrCuit: newOwner.dniOrCuit,
        phone: newOwner.phone,
        email: newOwner.email,
        address: newOwner.address,
        bankAccount: newOwner.bankAccount || undefined,
        commissionPercentage: parseFloat(newOwner.commissionPercentage) || 0,
      })
      await refreshOwners()
      setFormData(prev => ({ ...prev, ownerId: String(owner.id) }))
      setShowNewOwnerForm(false)
      setNewOwner({
        name: '',
        dniOrCuit: '',
        phone: '',
        email: '',
        address: '',
        bankAccount: '',
        commissionPercentage: '',
      })
    } catch (error) {
      console.error('Error creating owner:', error)
      alert('Error al crear el propietario')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generar uniqueId basado en tipo y timestamp
      const timestamp = Date.now()
      const uniqueId = `${propertyType.toUpperCase()}-${timestamp}`

      const apartmentData: any = {
        uniqueId,
        nomenclature: formData.nomenclature,
        propertyType: propertyType,
        area: parseFloat(formData.area) || 0,
        rooms: parseInt(formData.rooms) || 0,
        status: formData.status,
        saleStatus: formData.saleStatus,
      }

      // Si tiene propietario
      if (formData.ownerId) {
        apartmentData.ownerId = parseInt(formData.ownerId)
      }

      // Si es independiente
      if (isIndependent) {
        apartmentData.fullAddress = formData.fullAddress
        apartmentData.city = formData.city
        apartmentData.province = formData.province
      } else {
        // Si pertenece a un edificio
        apartmentData.buildingId = parseInt(formData.buildingId)
        apartmentData.floor = parseInt(formData.floor)
        apartmentData.apartmentLetter = formData.apartmentLetter
      }

      // Agregar especificaciones
      apartmentData.specifications = JSON.stringify(specifications)

      await apartmentsService.create(apartmentData)
      router.push('/apartments')
    } catch (error) {
      console.error('Error creating apartment:', error)
      alert('Error al crear el departamento. Por favor intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/apartments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Propiedades
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Home className="h-8 w-8 mr-3 text-blue-600" />
              Nueva Propiedad
            </h1>
            <p className="text-white/60 mt-2">
              Crea una propiedad independiente o asociada a un edificio
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Propiedad */}
        <Card>
          <CardHeader>
            <CardTitle>Tipo de Propiedad</CardTitle>
            <CardDescription>
              Selecciona el tipo de propiedad que deseas registrar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { value: 'casa', label: 'Casa', icon: Home, canBeInBuilding: false },
                { value: 'departamento', label: 'Departamento', icon: Building2, canBeInBuilding: true },
                { value: 'local', label: 'Local Comercial', icon: Building2, canBeInBuilding: false },
                { value: 'oficina', label: 'Oficina', icon: Building2, canBeInBuilding: true },
                { value: 'cochera', label: 'Cochera', icon: Building2, canBeInBuilding: true },
              ].map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setPropertyType(type.value)
                      // Si el tipo no puede estar en edificio, forzar independiente
                      if (!type.canBeInBuilding) {
                        setIsIndependent(true)
                      }
                      // Actualizar especificaciones por defecto
                      setSpecifications(getDefaultSpecifications(type.value))
                    }}
                    className={`p-4 rounded-lg transition-all ${
                      propertyType === type.value
                        ? 'bg-blue-500/10 shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-sm font-medium text-white">{type.label}</p>
                  </button>
                )
              })}
            </div>

            {/* Solo mostrar si el tipo puede estar en edificio */}
            {['departamento', 'oficina', 'cochera'].includes(propertyType) && (
              <div className="pt-4">
                <Label className="mb-3 block text-white/80">¿Pertenece a un edificio?</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsIndependent(true)}
                    className={`p-4 rounded-lg transition-all ${
                      isIndependent
                        ? 'bg-blue-500/10 shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                    }`}
                  >
                    <h3 className="font-semibold text-white mb-1">Independiente</h3>
                    <p className="text-xs text-white/60">
                      Propiedad sin edificio asociado
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsIndependent(false)}
                    className={`p-4 rounded-lg transition-all ${
                      !isIndependent
                        ? 'bg-blue-500/10 shadow-lg shadow-blue-500/20'
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                    }`}
                  >
                    <h3 className="font-semibold text-white mb-1">En Edificio</h3>
                    <p className="text-xs text-white/60">
                      Dentro de un edificio existente
                    </p>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Datos del Edificio o Ubicación */}
        {!isIndependent ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Datos del Edificio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="buildingId">Edificio *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewBuildingForm(!showNewBuildingForm)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Edificio
                  </Button>
                </div>
                
                {showNewBuildingForm ? (
                  <Card className="bg-blue-500/5 border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Crear Nuevo Edificio</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewBuildingForm(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Nombre del Edificio *</Label>
                        <Input
                          value={newBuilding.name}
                          onChange={(e) => setNewBuilding(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej: Edificio Central"
                        />
                      </div>
                      <div>
                        <Label>Dirección *</Label>
                        <Input
                          value={newBuilding.address}
                          onChange={(e) => setNewBuilding(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Ej: Av. Corrientes 1234"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Ciudad *</Label>
                          <Input
                            value={newBuilding.city}
                            onChange={(e) => setNewBuilding(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="Buenos Aires"
                          />
                        </div>
                        <div>
                          <Label>Provincia *</Label>
                          <Input
                            value={newBuilding.province}
                            onChange={(e) => setNewBuilding(prev => ({ ...prev, province: e.target.value }))}
                            placeholder="CABA"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Pisos *</Label>
                          <Input
                            type="number"
                            value={newBuilding.floors}
                            onChange={(e) => setNewBuilding(prev => ({ ...prev, floors: e.target.value }))}
                            placeholder="10"
                          />
                        </div>
                        <div>
                          <Label>Área Total (m²) *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newBuilding.totalArea}
                            onChange={(e) => setNewBuilding(prev => ({ ...prev, totalArea: e.target.value }))}
                            placeholder="1000"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Propietario del Edificio *</Label>
                        <Input
                          value={newBuilding.owner}
                          onChange={(e) => setNewBuilding(prev => ({ ...prev, owner: e.target.value }))}
                          placeholder="Nombre del propietario"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleCreateBuilding}
                        className="w-full"
                        disabled={!newBuilding.name || !newBuilding.address || !newBuilding.city}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Crear Edificio
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Select
                    id="buildingId"
                    value={formData.buildingId}
                    onChange={(e) => handleChange('buildingId', e.target.value)}
                    required
                  >
                    <option value="">Selecciona un edificio</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={String(building.id)}>
                        {building.name} - {building.address}
                      </option>
                    ))}
                  </Select>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="floor">Piso *</Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor}
                    onChange={(e) => handleChange('floor', e.target.value)}
                    placeholder="Ej: 3"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="apartmentLetter">Letra/Número *</Label>
                  <Input
                    id="apartmentLetter"
                    value={formData.apartmentLetter}
                    onChange={(e) => handleChange('apartmentLetter', e.target.value)}
                    placeholder="Ej: A, B, 101"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullAddress">Dirección Completa *</Label>
                <Input
                  id="fullAddress"
                  value={formData.fullAddress}
                  onChange={(e) => handleChange('fullAddress', e.target.value)}
                  placeholder="Ej: Av. Corrientes 1234, Piso 5, Depto B"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Ej: Buenos Aires"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="province">Provincia *</Label>
                  <Input
                    id="province"
                    value={formData.province}
                    onChange={(e) => handleChange('province', e.target.value)}
                    placeholder="Ej: CABA"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nomenclature">Nomenclatura *</Label>
              <Input
                id="nomenclature"
                value={formData.nomenclature}
                onChange={(e) => handleChange('nomenclature', e.target.value)}
                placeholder="Ej: 3A, 101, Depto 5B"
                required
              />
              <p className="text-sm text-white/60 mt-1">
                Identificador único para la propiedad
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Área (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  step="0.01"
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  placeholder="Ej: 45.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rooms">Ambientes *</Label>
                <Input
                  id="rooms"
                  type="number"
                  value={formData.rooms}
                  onChange={(e) => handleChange('rooms', e.target.value)}
                  placeholder="Ej: 2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as ApartmentStatus)}
                >
                  <option value={ApartmentStatus.AVAILABLE}>Disponible</option>
                  <option value={ApartmentStatus.RENTED}>Alquilado</option>
                  <option value={ApartmentStatus.UNDER_RENOVATION}>En Refacción</option>
                  <option value={ApartmentStatus.PERSONAL_USE}>Uso Propio</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="saleStatus">Estado de Venta</Label>
                <Select
                  id="saleStatus"
                  value={formData.saleStatus}
                  onChange={(e) => handleChange('saleStatus', e.target.value as SaleStatus)}
                >
                  <option value={SaleStatus.NOT_FOR_SALE}>No está en venta</option>
                  <option value={SaleStatus.FOR_SALE}>En venta</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Propietario */}
        <Card>
          <CardHeader>
            <CardTitle>Propietario (Opcional)</CardTitle>
            <CardDescription>
              Asigna un propietario a esta propiedad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="ownerId">Propietario</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewOwnerForm(!showNewOwnerForm)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nuevo Propietario
                </Button>
              </div>
              
              {showNewOwnerForm ? (
                <Card className="bg-blue-500/5 border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Crear Nuevo Propietario</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewOwnerForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Nombre Completo *</Label>
                      <Input
                        value={newOwner.name}
                        onChange={(e) => setNewOwner(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>DNI/CUIT *</Label>
                        <Input
                          value={newOwner.dniOrCuit}
                          onChange={(e) => setNewOwner(prev => ({ ...prev, dniOrCuit: e.target.value }))}
                          placeholder="12345678"
                        />
                      </div>
                      <div>
                        <Label>Teléfono *</Label>
                        <Input
                          value={newOwner.phone}
                          onChange={(e) => setNewOwner(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+54 11 1234-5678"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={newOwner.email}
                        onChange={(e) => setNewOwner(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="propietario@email.com"
                      />
                    </div>
                    <div>
                      <Label>Dirección *</Label>
                      <Input
                        value={newOwner.address}
                        onChange={(e) => setNewOwner(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Calle 123, Ciudad"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Cuenta Bancaria</Label>
                        <Input
                          value={newOwner.bankAccount}
                          onChange={(e) => setNewOwner(prev => ({ ...prev, bankAccount: e.target.value }))}
                          placeholder="CBU/Alias"
                        />
                      </div>
                      <div>
                        <Label>Comisión (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newOwner.commissionPercentage}
                          onChange={(e) => setNewOwner(prev => ({ ...prev, commissionPercentage: e.target.value }))}
                          placeholder="5"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleCreateOwner}
                      className="w-full"
                      disabled={!newOwner.name || !newOwner.dniOrCuit || !newOwner.phone || !newOwner.email || !newOwner.address}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Crear Propietario
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Select
                  id="ownerId"
                  value={formData.ownerId}
                  onChange={(e) => handleChange('ownerId', e.target.value)}
                >
                  <option value="">Sin propietario</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={String(owner.id)}>
                      {owner.name} - {owner.dniOrCuit}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Especificaciones */}
        <PropertySpecifications
          propertyType={propertyType}
          value={specifications}
          onChange={(newSpecs) => setSpecifications(newSpecs)}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/apartments">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creando...' : 'Crear Propiedad'}
          </Button>
        </div>
      </form>
    </div>
  )
}
