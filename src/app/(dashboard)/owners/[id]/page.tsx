'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Mail, Phone, MapPin, CreditCard, Building2, Home, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { useOwner } from '@/hooks/useOwners'
import { formatArea, formatCurrency } from '@/lib/utils'

export default function OwnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { owner, loading } = useOwner(parseInt(id))

  if (loading) {
    return <Loading size="lg" text="Cargando propietario..." />
  }

  if (!owner) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white">Propietario no encontrado</h2>
        <Button onClick={() => router.push('/owners')} className="mt-4">
          Volver a Propietarios
        </Button>
      </div>
    )
  }

  const totalProperties = owner.apartments?.length || 0
  const rentedProperties = owner.apartments?.filter(apt => apt.status === 'alquilado').length || 0
  const availableProperties = owner.apartments?.filter(apt => apt.status === 'disponible').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold text-white">{owner.name}</h1>
            <p className="text-white/60 mt-1">
              DNI/CUIT: {owner.dniOrCuit}
            </p>
          </div>
        </div>
        <Link href={`/owners/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Propiedades
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alquiladas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{rentedProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disponibles
            </CardTitle>
            <Home className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{availableProperties}</div>
          </CardContent>
        </Card>
      </div>

      {/* Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{owner.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{owner.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="font-medium">{owner.address}</p>
              </div>
            </div>

            {owner.bankAccount && (
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Cuenta Bancaria</p>
                  <p className="font-medium font-mono">{owner.bankAccount}</p>
                </div>
              </div>
            )}
          </div>

          {owner.commissionPercentage > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Comisión Inmobiliaria</span>
                <Badge variant="outline" className="text-lg">
                  {owner.commissionPercentage}%
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades</CardTitle>
          <CardDescription>
            {totalProperties === 0 
              ? 'Este propietario no tiene propiedades registradas'
              : `${totalProperties} propiedad(es) registrada(s)`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {owner.apartments && owner.apartments.length > 0 ? (
            <div className="space-y-3">
              {owner.apartments.map((apartment) => (
                <Link
                  key={apartment.id}
                  href={`/apartments/${apartment.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                        <Home className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white group-hover:text-blue-600 transition-colors">
                          {apartment.building 
                            ? `${apartment.building.name} - ${apartment.nomenclature}`
                            : apartment.fullAddress || apartment.nomenclature
                          }
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-white/60">
                            {apartment.area ? formatArea(apartment.area) : 'N/A'}
                          </p>
                          <Badge 
                            variant="outline" 
                            size="sm"
                            className={
                              apartment.status === 'alquilado' 
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }
                          >
                            {apartment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Home className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-gray-500">No hay propiedades registradas</p>
              <Link href="/apartments/new">
                <Button variant="outline" className="mt-4">
                  Agregar Propiedad
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
