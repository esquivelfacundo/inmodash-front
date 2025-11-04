'use client'

import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  // TODO: Get user data from auth context/hook
  const user = {
    name: 'Usuario Demo',
    email: 'usuario@demo.com',
    phone: '+54 9 11 1234-5678',
    address: 'Buenos Aires, Argentina',
    role: 'Administrador',
    joinedDate: '2024-01-15',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
        <p className="text-white/60 mt-2">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-base">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="text-white">{user.email}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Teléfono
              </label>
              <p className="text-white">{user.phone}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ubicación
              </label>
              <p className="text-white">{user.address}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Rol
              </label>
              <p className="text-white">{user.role}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Miembro desde
              </label>
              <p className="text-white">
                {new Date(user.joinedDate).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button>
              Editar Perfil
            </Button>
            <Button variant="outline">
              Cambiar Contraseña
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
          <CardDescription>
            Detalles adicionales sobre tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium text-white">Estado de la cuenta</p>
                <p className="text-sm text-gray-500">Tu cuenta está activa y verificada</p>
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                Activa
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <p className="font-medium text-white">Autenticación de dos factores</p>
                <p className="text-sm text-gray-500">Agrega una capa extra de seguridad</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-white">Notificaciones</p>
                <p className="text-sm text-gray-500">Gestiona tus preferencias de notificación</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
