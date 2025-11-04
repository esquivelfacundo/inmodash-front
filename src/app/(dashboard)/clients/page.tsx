'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, FileText, Calendar, TrendingUp, Mail, Phone, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { Badge } from '@/components/ui/badge'
import { useTenants } from '@/hooks/useTenants'

export default function ClientsPage() {
  const router = useRouter()
  const { tenants, loading, deleteTenant } = useTenants()
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const stats = {
    totalTenants: tenants.length,
    activeContracts: 0,
    expiringSoon: 0,
    totalGuarantors: 0,
  }
  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteTenant(deleteConfirm)
        setDeleteConfirm(null)
      } catch {
        alert('Error al eliminar el cliente. Por favor intente nuevamente.')
      }
    }
  }

  if (loading) {
    return <Loading size="lg" text="Cargando clientes..." />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-white/60 mt-2">
            Gestiona tus clientes e inquilinos
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Activos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeContracts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencen Pronto</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringSoon}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garantes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuarantors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tenants List */}
      {tenants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No hay clientes registrados
            </h3>
            <p className="text-white/60 text-center mb-6 max-w-md">
              Los clientes se crean desde los departamentos cuando asignas un inquilino.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{tenant.nameOrBusiness}</span>
                  <Badge variant="outline">Cliente</Badge>
                </CardTitle>
                <CardDescription>DNI/CUIT: {tenant.dniOrCuit}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-white/60">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{tenant.contactName}</span>
                  </div>
                  <div className="flex items-center text-white/60">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{tenant.contactPhone}</span>
                  </div>
                  <div className="flex items-center text-white/60">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{tenant.contactEmail}</span>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-white/60">Dirección:</p>
                  <p className="text-sm font-medium">{tenant.address}</p>
                </div>
                <div className="flex space-x-2 pt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => router.push(`/clients/${tenant.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setDeleteConfirm(tenant.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Trash2 className="h-5 w-5 mr-2" />
                Confirmar Eliminación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90">
                ¿Está seguro que desea eliminar este cliente?
              </p>
              <p className="text-sm text-white/60">
                Esta acción no se puede deshacer. Se eliminarán también todos los garantes asociados.
              </p>
              <div className="flex space-x-3 justify-end">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
