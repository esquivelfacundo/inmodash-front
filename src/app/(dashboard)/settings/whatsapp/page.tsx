'use client'

import { useState, useEffect } from 'react'
import { Bot, CheckCircle, XCircle, Loader2, Save, Trash2, Power } from 'lucide-react'
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'

interface WhatsAppConfig {
  id: number
  wabaId: string
  phoneNumberId: string
  botName: string
  companyName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function WhatsAppSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [config, setConfig] = useState<WhatsAppConfig | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    wabaId: '',
    phoneNumberId: '',
    accessToken: '',
    verifyToken: '',
    botName: 'Martina',
    companyName: '',
  })

  // Load existing configuration
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://inmodash-back-production.up.railway.app/api/whatsapp/config', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success && data.data) {
        setConfig(data.data)
        setFormData({
          wabaId: data.data.wabaId,
          phoneNumberId: data.data.phoneNumberId,
          accessToken: '', // Don't populate for security
          verifyToken: '', // Don't populate for security
          botName: data.data.botName,
          companyName: data.data.companyName,
        })
      }
    } catch (error) {
      console.error('Error loading config:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cargar la configuración',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.wabaId || !formData.phoneNumberId || !formData.companyName) {
        toast({
          title: 'Error',
          description: 'Por favor completa todos los campos requeridos',
          variant: 'destructive',
        })
        return
      }

      // If updating, tokens are optional
      if (!config && (!formData.accessToken || !formData.verifyToken)) {
        toast({
          title: 'Error',
          description: 'Los tokens son requeridos para la configuración inicial',
          variant: 'destructive',
        })
        return
      }

      setSaving(true)

      const payload: any = {
        wabaId: formData.wabaId,
        phoneNumberId: formData.phoneNumberId,
        botName: formData.botName,
        companyName: formData.companyName,
      }

      // Only include tokens if they're provided
      if (formData.accessToken) payload.accessToken = formData.accessToken
      if (formData.verifyToken) payload.verifyToken = formData.verifyToken

      const response = await fetch('https://inmodash-back-production.up.railway.app/api/whatsapp/config', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Éxito',
          description: data.message || 'Configuración guardada correctamente',
        })
        loadConfig() // Reload to get updated data
      } else {
        toast({
          title: 'Error',
          description: data.error || 'No se pudo guardar la configuración',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast({
        title: 'Error',
        description: 'Error al guardar la configuración',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    try {
      setTesting(true)

      const response = await fetch('https://inmodash-back-production.up.railway.app/api/whatsapp/config/test', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Conexión exitosa',
          description: data.message || 'La conexión con WhatsApp API funciona correctamente',
        })
      } else {
        toast({
          title: 'Error de conexión',
          description: data.error || 'No se pudo conectar con WhatsApp API',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error testing connection:', error)
      toast({
        title: 'Error',
        description: 'Error al probar la conexión',
        variant: 'destructive',
      })
    } finally {
      setTesting(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      const response = await fetch('https://inmodash-back-production.up.railway.app/api/whatsapp/config/toggle', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !config?.isActive }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Éxito',
          description: data.message || `Bot ${!config?.isActive ? 'activado' : 'desactivado'} correctamente`,
        })
        loadConfig()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'No se pudo cambiar el estado del bot',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error toggling bot:', error)
      toast({
        title: 'Error',
        description: 'Error al cambiar el estado del bot',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar la configuración de WhatsApp? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch('https://inmodash-back-production.up.railway.app/api/whatsapp/config', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Éxito',
          description: data.message || 'Configuración eliminada correctamente',
        })
        setConfig(null)
        setFormData({
          wabaId: '',
          phoneNumberId: '',
          accessToken: '',
          verifyToken: '',
          botName: 'Martina',
          companyName: '',
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'No se pudo eliminar la configuración',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting config:', error)
      toast({
        title: 'Error',
        description: 'Error al eliminar la configuración',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Bot de WhatsApp</h1>
        <p className="text-white/60 mt-2">
          Configura tu bot de atención al cliente para WhatsApp Business
        </p>
      </div>

      {/* Status Card */}
      {config && (
        <GlassCard>
          <GlassCardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${config.isActive ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                  <Bot className={`h-6 w-6 ${config.isActive ? 'text-green-400' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Estado del Bot: {config.isActive ? 'Activo' : 'Inactivo'}
                  </h3>
                  <p className="text-sm text-white/60">
                    {config.isActive 
                      ? 'El bot está respondiendo mensajes automáticamente' 
                      : 'El bot está desactivado y no responderá mensajes'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.isActive}
                  onCheckedChange={handleToggleActive}
                />
                <Power className={`h-5 w-5 ${config.isActive ? 'text-green-400' : 'text-gray-400'}`} />
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      )}

      {/* Configuration Form */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="text-white">Configuración de WhatsApp Business API</GlassCardTitle>
          <GlassCardDescription className="text-white/60">
            Ingresa las credenciales de tu cuenta de WhatsApp Business
          </GlassCardDescription>
        </GlassCardHeader>
        <GlassCardContent className="space-y-6">
          {/* WABA ID */}
          <div className="space-y-2">
            <Label htmlFor="wabaId" className="text-white">
              WhatsApp Business Account ID (WABA ID) *
            </Label>
            <Input
              id="wabaId"
              value={formData.wabaId}
              onChange={(e) => setFormData({ ...formData, wabaId: e.target.value })}
              placeholder="123456789012345"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Phone Number ID */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumberId" className="text-white">
              Phone Number ID *
            </Label>
            <Input
              id="phoneNumberId"
              value={formData.phoneNumberId}
              onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
              placeholder="987654321098765"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Access Token */}
          <div className="space-y-2">
            <Label htmlFor="accessToken" className="text-white">
              Permanent Access Token {config ? '(dejar vacío para mantener el actual)' : '*'}
            </Label>
            <Input
              id="accessToken"
              type="password"
              value={formData.accessToken}
              onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
              placeholder="EAAxxxxxxxxxxxxxxxxx"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Verify Token */}
          <div className="space-y-2">
            <Label htmlFor="verifyToken" className="text-white">
              Verify Token {config ? '(dejar vacío para mantener el actual)' : '*'}
            </Label>
            <Input
              id="verifyToken"
              type="password"
              value={formData.verifyToken}
              onChange={(e) => setFormData({ ...formData, verifyToken: e.target.value })}
              placeholder="mi_token_secreto_123"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Bot Name */}
          <div className="space-y-2">
            <Label htmlFor="botName" className="text-white">
              Nombre del Bot
            </Label>
            <Input
              id="botName"
              value={formData.botName}
              onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
              placeholder="Martina"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white">
              Nombre de la Inmobiliaria *
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Inmobiliaria XYZ"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </>
              )}
            </Button>

            {config && (
              <>
                <Button
                  onClick={handleTest}
                  disabled={testing}
                  variant="outline"
                  className="bg-white/5 hover:bg-white/10"
                >
                  {testing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Probando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Probar Conexión
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/30"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Configuración
                </Button>
              </>
            )}
          </div>
        </GlassCardContent>
      </GlassCard>

      {/* Help Card */}
      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle className="text-white">¿Cómo obtener las credenciales?</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="space-y-4 text-white/80">
          <div>
            <h4 className="font-semibold text-white mb-2">1. Crear una App en Meta for Developers</h4>
            <p className="text-sm">Visita <a href="https://developers.facebook.com" target="_blank" className="text-blue-400 hover:underline">developers.facebook.com</a> y crea una nueva aplicación de tipo "Business".</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">2. Agregar WhatsApp Product</h4>
            <p className="text-sm">En tu aplicación, agrega el producto "WhatsApp" y configura tu número de teléfono.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">3. Obtener credenciales</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              <li><strong>WABA ID:</strong> En WhatsApp → Settings → Business Account</li>
              <li><strong>Phone Number ID:</strong> En WhatsApp → API Setup</li>
              <li><strong>Access Token:</strong> Genera un token permanente en WhatsApp → API Setup</li>
              <li><strong>Verify Token:</strong> Crea un token personalizado (cualquier string seguro)</li>
            </ul>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
