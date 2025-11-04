'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, MapPin, Edit, Trash2, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { useTenant, useTenants } from '@/hooks/useTenants'
import { useGuarantorsByTenant } from '@/hooks/useGuarantors'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tenantId = Number(params.id)

  const { tenant, loading: tenantLoading } = useTenant(tenantId)
  const { guarantors, loading: guarantorsLoading, deleteGuarantor } = useGuarantorsByTenant(tenantId)
  const { deleteTenant } = useTenants()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteGuarantorConfirm, setDeleteGuarantorConfirm] = useState<number | null>(null)

  const loading = tenantLoading || guarantorsLoading

  const handleDelete = async () => {
    try {
      await deleteTenant(tenantId)
      router.push('/clients')
    } catch {
      alert('Error al eliminar el cliente. Por favor intente nuevamente.')
    }
  }

  const handleDeleteGuarantor = async () => {
    if (deleteGuarantorConfirm) {
      try {
        await deleteGuarantor(deleteGuarantorConfirm)
        setDeleteGuarantorConfirm(null)
      } catch {
        alert('Error al eliminar el garante. Por favor intente nuevamente.')
      }
    }
  }

  if (loading) {
    return <Loading size="lg" text="Cargando cliente..." />
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <User className="h-16 w-16 text-white/20 mb-4" />
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/clients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <User className="h-8 w-8 mr-3 text-blue-600" />
              {tenant.nameOrBusiness}
            </h1>
            <p className="text-white/60 mt-2">
              DNI/CUIT: <span className="font-mono font-medium">{tenant.dniOrCuit}</span>
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => router.push(`/clients/${tenant.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-white/60">Nombre o Razón Social</p>
              <p className="font-medium">{tenant.nameOrBusiness}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">DNI/CUIT</p>
              <p className="font-medium font-mono">{tenant.dniOrCuit}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Dirección</p>
              <p className="font-medium flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                {tenant.address}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-white/60">Persona de Contacto</p>
              <p className="font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                {tenant.contactName}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Teléfono</p>
              <p className="font-medium flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {tenant.contactPhone}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Email</p>
              <p className="font-medium flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {tenant.contactEmail}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/60">Dirección de Contacto</p>
              <p className="font-medium flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                {tenant.contactAddress}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guarantors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Garantes ({guarantors.length})
          </CardTitle>
          <CardDescription>
            Personas que garantizan los contratos de este cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {guarantors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay garantes registrados para este cliente
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guarantors.map((guarantor) => (
                <Card key={guarantor.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{guarantor.name}</p>
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-sm text-white/60 space-y-1">
                        <p>DNI: {guarantor.dni}</p>
                        <p className="flex items-start">
                          <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                          {guarantor.address}
                        </p>
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {guarantor.phone}
                        </p>
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {guarantor.email}
                        </p>
                      </div>
                      <div className="flex space-x-2 pt-3 border-t mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => router.push(`/guarantors/${guarantor.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setDeleteGuarantorConfirm(guarantor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
                ¿Está seguro que desea eliminar el cliente <strong>{tenant.nameOrBusiness}</strong>?
              </p>
              <p className="text-sm text-white/60">
                Esta acción no se puede deshacer. Se eliminarán también todos los garantes asociados ({guarantors.length}).
              </p>
              <div className="flex space-x-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
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

      {/* Delete Guarantor Confirmation Modal */}
      {deleteGuarantorConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Trash2 className="h-5 w-5 mr-2" />
                Confirmar Eliminación de Garante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90">
                ¿Está seguro que desea eliminar este garante?
              </p>
              <p className="text-sm text-white/60">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex space-x-3 justify-end">
                <Button variant="outline" onClick={() => setDeleteGuarantorConfirm(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDeleteGuarantor}>
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
