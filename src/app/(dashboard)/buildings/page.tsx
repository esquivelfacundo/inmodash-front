'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Plus, MapPin, Users, Edit } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { useBuildings } from '@/hooks/useBuildings'
import { formatArea } from '@/lib/utils'

export default function BuildingsPage() {
  const router = useRouter()
  const { buildings, loading } = useBuildings()

  if (loading) {
    return <Loading size="lg" text="Cargando edificios..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Edificios</h1>
          <p className="text-white/60 mt-2">
            Gestiona todos tus edificios y propiedades
          </p>
        </div>
        <Link href="/buildings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Edificio
          </Button>
        </Link>
      </div>

      {/* Buildings Grid */}
      {buildings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No hay edificios registrados
            </h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              Comienza creando tu primer edificio para gestionar tus propiedades inmobiliarias.
            </p>
            <Link href="/buildings/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Edificio
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((building) => (
            <Card key={building.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{building.name}</CardTitle>
                  </div>
                </div>
                <CardDescription className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{building.address}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60">Ciudad</p>
                    <p className="font-medium text-white">{building.city}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Provincia</p>
                    <p className="font-medium text-white">{building.province}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Pisos</p>
                    <p className="font-medium text-white">{building.floors}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Departamentos</p>
                    <p className="font-medium text-white flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {building.apartments?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="border-t  pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Área Total:</span>
                    <span className="font-medium text-white">{formatArea(building.totalArea)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-white/60">Titular:</span>
                    <span className="font-medium text-white">{building.owner}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Link href={`/buildings/${building.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ver Detalles
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push(`/buildings/${building.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Link href={`/buildings/${building.id}/apartments/new`}>
                    <Button size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
