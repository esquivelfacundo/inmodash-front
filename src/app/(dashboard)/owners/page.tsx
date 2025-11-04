'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Users, Plus, Mail, Phone, Building2, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { useOwners } from '@/hooks/useOwners'

export default function OwnersPage() {
  const router = useRouter()
  const { owners, loading, deleteOwner } = useOwners()

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`¿Está seguro de eliminar al propietario "${name}"?`)) {
      try {
        await deleteOwner(id)
      } catch (error) {
        // Error already handled in hook
      }
    }
  }

  if (loading) {
    return <Loading size="lg" text="Cargando propietarios..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Propietarios</h1>
          <p className="text-white/60 mt-2">
            Gestiona los propietarios de las propiedades
          </p>
        </div>
        <Link href="/owners/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Propietario
          </Button>
        </Link>
      </div>

      {/* Owners Grid */}
      {owners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No hay propietarios registrados
            </h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              Comienza registrando propietarios para gestionar sus propiedades.
            </p>
            <Link href="/owners/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Propietario
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {owners.map((owner) => (
            <Card key={owner.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{owner.name}</CardTitle>
                  </div>
                  {owner.commissionPercentage > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {owner.commissionPercentage}% comisión
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center space-x-1">
                  <span className="font-mono text-xs">{owner.dniOrCuit}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-white/60">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{owner.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/60">
                    <Phone className="h-4 w-4" />
                    <span>{owner.phone}</span>
                  </div>
                  {owner.apartments && owner.apartments.length > 0 && (
                    <div className="flex items-center space-x-2 text-white/60">
                      <Building2 className="h-4 w-4" />
                      <span>{owner.apartments.length} propiedad(es)</span>
                    </div>
                  )}
                </div>

                {owner.bankAccount && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500">Cuenta Bancaria</p>
                    <p className="text-sm font-mono">{owner.bankAccount}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <Link href={`/owners/${owner.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ver Detalles
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push(`/owners/${owner.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(Number(owner.id), owner.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
