'use client'

import { Settings, Bell, Lock, Globe, Database, Palette, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
        <p className="text-white/60 mt-2">
          Personaliza tu experiencia en el sistema
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración General
          </CardTitle>
          <CardDescription>
            Ajustes básicos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium text-white">Idioma</p>
              <p className="text-sm text-gray-500">Selecciona el idioma de la interfaz</p>
            </div>
            <select className="px-3 py-2 border -300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Español</option>
              <option>English</option>
              <option>Português</option>
            </select>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium text-white">Zona horaria</p>
              <p className="text-sm text-gray-500">Ajusta la zona horaria para fechas y horas</p>
            </div>
            <select className="px-3 py-2 border -300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>GMT-3 (Buenos Aires)</option>
              <option>GMT-5 (New York)</option>
              <option>GMT+0 (London)</option>
            </select>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-white">Formato de fecha</p>
              <p className="text-sm text-gray-500">Cómo se muestran las fechas</p>
            </div>
            <select className="px-3 py-2 border -300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Gestiona cómo y cuándo recibes notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium text-white">Notificaciones por email</p>
              <p className="text-sm text-gray-500">Recibe actualizaciones importantes por correo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after: after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-900/50 after:-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium text-white">Notificaciones de pagos</p>
              <p className="text-sm text-gray-500">Alertas sobre pagos pendientes y vencidos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after: after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-900/50 after:-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-white">Notificaciones de contratos</p>
              <p className="text-sm text-gray-500">Alertas sobre vencimientos de contratos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after: after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-900/50 after:-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Seguridad
          </CardTitle>
          <CardDescription>
            Protege tu cuenta y datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium text-white">Cambiar contraseña</p>
              <p className="text-sm text-gray-500">Actualiza tu contraseña regularmente</p>
            </div>
            <Button variant="outline" size="sm">
              Cambiar
            </Button>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium text-white">Autenticación de dos factores</p>
              <p className="text-sm text-gray-500">Agrega seguridad extra a tu cuenta</p>
            </div>
            <Button variant="outline" size="sm">
              Activar
            </Button>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-white">Sesiones activas</p>
              <p className="text-sm text-gray-500">Gestiona tus dispositivos conectados</p>
            </div>
            <Button variant="outline" size="sm">
              Ver sesiones
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Apariencia
          </CardTitle>
          <CardDescription>
            Personaliza la interfaz del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium text-white">Tema</p>
              <p className="text-sm text-gray-500">Selecciona el tema de la interfaz</p>
            </div>
            <select className="px-3 py-2 border -300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Claro</option>
              <option>Oscuro</option>
              <option>Automático</option>
            </select>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-white">Densidad de la interfaz</p>
              <p className="text-sm text-gray-500">Ajusta el espaciado de los elementos</p>
            </div>
            <select className="px-3 py-2 border -300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Compacta</option>
              <option>Normal</option>
              <option>Espaciosa</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Cancelar
        </Button>
        <Button>
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}
