'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { NumberInput } from './NumberInput'
import { propertySpecifications, type SpecificationField } from '@/config/property-specifications'
import { Check, X } from 'lucide-react'

interface PropertySpecificationsProps {
  propertyType: string
  value?: Record<string, any>
  onChange?: (specifications: Record<string, any>) => void
  readOnly?: boolean
}

export function PropertySpecifications({
  propertyType,
  value = {},
  onChange,
  readOnly = false
}: PropertySpecificationsProps) {
  const [specs, setSpecs] = useState<Record<string, any>>(value)
  const fields = propertySpecifications[propertyType] || []

  useEffect(() => {
    setSpecs(value)
  }, [value])

  const handleChange = (key: string, newValue: any) => {
    const updated = { ...specs, [key]: newValue }
    
    // Lógica condicional: si cochera es "No", resetear espacios de cochera
    if (key === 'garage' && newValue === false) {
      updated.garageSpaces = 0
    }
    
    setSpecs(updated)
    onChange?.(updated)
  }

  // Función para determinar si un campo debe mostrarse
  const shouldShowField = (field: SpecificationField): boolean => {
    // Si cochera es false, no mostrar espacios de cochera
    if (field.key === 'garageSpaces' && specs.garage === false) {
      return false
    }
    
    return true
  }

  if (fields.length === 0) {
    return null
  }

  if (readOnly) {
    // Vista de solo lectura
    const hasAnyValue = fields.some(field => {
      const val = specs[field.key]
      if (field.type === 'boolean') return val === true
      if (field.type === 'number') return val > 0
      return val !== undefined && val !== null && val !== ''
    })

    if (!hasAnyValue) {
      return null
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Especificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fields.map((field) => {
              const val = specs[field.key]
              
              // Solo mostrar si tiene valor
              if (field.type === 'boolean' && !val) return null
              if (field.type === 'number' && (!val || val === 0)) return null
              if (!val && val !== 0 && val !== false) return null

              return (
                <div key={field.key} className="flex items-center gap-2">
                  {field.type === 'boolean' ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-white/80">{field.label}</span>
                    </>
                  ) : (
                    <div>
                      <p className="text-xs text-white/60">{field.label}</p>
                      <p className="text-sm font-medium text-white">{val}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Vista de edición
  return (
    <Card>
      <CardHeader>
        <CardTitle>Especificaciones</CardTitle>
        <CardDescription>
          Características específicas de este tipo de propiedad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.filter(shouldShowField).map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {field.type === 'boolean' && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange(field.key, true)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      specs[field.key] === true
                        ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                        : 'bg-slate-800/30 text-white/60 hover:bg-slate-800/50'
                    }`}
                  >
                    <Check className="h-4 w-4 inline mr-1" />
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange(field.key, false)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      specs[field.key] === false
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                        : 'bg-slate-800/30 text-white/60 hover:bg-slate-800/50'
                    }`}
                  >
                    <X className="h-4 w-4 inline mr-1" />
                    No
                  </button>
                </div>
              )}

              {field.type === 'number' && (
                <NumberInput
                  value={specs[field.key] ?? field.defaultValue ?? 0}
                  onChange={(value) => handleChange(field.key, value)}
                  min={field.min ?? 0}
                  max={field.max ?? 99}
                  step={field.key === 'height' ? 0.1 : 1}
                />
              )}

              {field.type === 'text' && (
                <Input
                  id={field.key}
                  type="text"
                  value={specs[field.key] ?? field.defaultValue ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}

              {field.type === 'select' && field.options && (
                <Select
                  id={field.key}
                  value={specs[field.key] ?? field.defaultValue ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
