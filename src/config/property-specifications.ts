/**
 * Configuración de especificaciones por tipo de propiedad
 */

export interface SpecificationField {
  key: string
  label: string
  type: 'number' | 'boolean' | 'text' | 'select'
  options?: string[]
  defaultValue?: any
  required?: boolean
  min?: number
  max?: number
}

export const propertySpecifications: Record<string, SpecificationField[]> = {
  // Casa
  casa: [
    { key: 'bedrooms', label: 'Dormitorios', type: 'number', defaultValue: 0, min: 0, max: 20 },
    { key: 'bathrooms', label: 'Baños', type: 'number', defaultValue: 0, min: 0, max: 10 },
    { key: 'halfBathrooms', label: 'Toilettes', type: 'number', defaultValue: 0, min: 0, max: 5 },
    { key: 'garage', label: 'Cochera', type: 'boolean', defaultValue: false },
    { key: 'garageSpaces', label: 'Espacios de cochera', type: 'number', defaultValue: 0, min: 0, max: 10 },
    { key: 'garden', label: 'Jardín', type: 'boolean', defaultValue: false },
    { key: 'pool', label: 'Piscina', type: 'boolean', defaultValue: false },
    { key: 'grill', label: 'Parrilla', type: 'boolean', defaultValue: false },
    { key: 'terrace', label: 'Terraza', type: 'boolean', defaultValue: false },
    { key: 'balcony', label: 'Balcón', type: 'boolean', defaultValue: false },
    { key: 'furnished', label: 'Amueblado', type: 'boolean', defaultValue: false },
    { key: 'airConditioning', label: 'Aire acondicionado', type: 'boolean', defaultValue: false },
    { key: 'heating', label: 'Calefacción', type: 'boolean', defaultValue: false },
  ],

  // Departamento
  departamento: [
    { key: 'bedrooms', label: 'Dormitorios', type: 'number', defaultValue: 0, min: 0, max: 10 },
    { key: 'bathrooms', label: 'Baños', type: 'number', defaultValue: 0, min: 0, max: 5 },
    { key: 'halfBathrooms', label: 'Toilettes', type: 'number', defaultValue: 0, min: 0, max: 3 },
    { key: 'balcony', label: 'Balcón', type: 'boolean', defaultValue: false },
    { key: 'terrace', label: 'Terraza', type: 'boolean', defaultValue: false },
    { key: 'garage', label: 'Cochera', type: 'boolean', defaultValue: false },
    { key: 'garageSpaces', label: 'Espacios de cochera', type: 'number', defaultValue: 0, min: 0, max: 5 },
    { key: 'storage', label: 'Baulera', type: 'boolean', defaultValue: false },
    { key: 'furnished', label: 'Amueblado', type: 'boolean', defaultValue: false },
    { key: 'airConditioning', label: 'Aire acondicionado', type: 'boolean', defaultValue: false },
    { key: 'heating', label: 'Calefacción', type: 'boolean', defaultValue: false },
    { key: 'laundryRoom', label: 'Lavadero', type: 'boolean', defaultValue: false },
  ],

  // Local Comercial
  local: [
    { key: 'bathrooms', label: 'Baños', type: 'number', defaultValue: 0, min: 0, max: 5 },
    { key: 'storefront', label: 'Vidriera', type: 'boolean', defaultValue: false },
    { key: 'storage', label: 'Depósito', type: 'boolean', defaultValue: false },
    { key: 'kitchen', label: 'Cocina', type: 'boolean', defaultValue: false },
    { key: 'airConditioning', label: 'Aire acondicionado', type: 'boolean', defaultValue: false },
    { key: 'heating', label: 'Calefacción', type: 'boolean', defaultValue: false },
    { key: 'alarm', label: 'Alarma', type: 'boolean', defaultValue: false },
    { key: 'securityCameras', label: 'Cámaras de seguridad', type: 'boolean', defaultValue: false },
    { key: 'loadingDock', label: 'Muelle de carga', type: 'boolean', defaultValue: false },
    { key: 'parking', label: 'Estacionamiento', type: 'boolean', defaultValue: false },
  ],

  // Oficina
  oficina: [
    { key: 'bathrooms', label: 'Baños', type: 'number', defaultValue: 0, min: 0, max: 5 },
    { key: 'privateOffices', label: 'Oficinas privadas', type: 'number', defaultValue: 0, min: 0, max: 20 },
    { key: 'meetingRooms', label: 'Salas de reunión', type: 'number', defaultValue: 0, min: 0, max: 10 },
    { key: 'kitchen', label: 'Cocina/Kitchenette', type: 'boolean', defaultValue: false },
    { key: 'reception', label: 'Recepción', type: 'boolean', defaultValue: false },
    { key: 'furnished', label: 'Amueblada', type: 'boolean', defaultValue: false },
    { key: 'airConditioning', label: 'Aire acondicionado', type: 'boolean', defaultValue: false },
    { key: 'heating', label: 'Calefacción', type: 'boolean', defaultValue: false },
    { key: 'internet', label: 'Internet', type: 'boolean', defaultValue: false },
    { key: 'alarm', label: 'Alarma', type: 'boolean', defaultValue: false },
    { key: 'securityCameras', label: 'Cámaras de seguridad', type: 'boolean', defaultValue: false },
  ],

  // Cochera
  cochera: [
    { key: 'covered', label: 'Cubierta', type: 'boolean', defaultValue: false },
    { key: 'size', label: 'Tamaño', type: 'select', options: ['Chica', 'Mediana', 'Grande'], defaultValue: 'Mediana' },
    { key: 'height', label: 'Altura libre (m)', type: 'number', defaultValue: 2.0, min: 1.5, max: 5.0 },
    { key: 'electricGate', label: 'Portón eléctrico', type: 'boolean', defaultValue: false },
    { key: 'securityCameras', label: 'Cámaras de seguridad', type: 'boolean', defaultValue: false },
    { key: 'lighting', label: 'Iluminación', type: 'boolean', defaultValue: false },
  ],
}

/**
 * Obtiene las especificaciones por defecto para un tipo de propiedad
 */
export function getDefaultSpecifications(propertyType: string): Record<string, any> {
  const specs = propertySpecifications[propertyType] || []
  const defaults: Record<string, any> = {}
  
  specs.forEach(spec => {
    defaults[spec.key] = spec.defaultValue
  })
  
  return defaults
}

/**
 * Valida que las especificaciones cumplan con los requisitos
 */
export function validateSpecifications(
  propertyType: string,
  specifications: Record<string, any>
): { valid: boolean; errors: string[] } {
  const specs = propertySpecifications[propertyType] || []
  const errors: string[] = []
  
  specs.forEach(spec => {
    const value = specifications[spec.key]
    
    // Validar requeridos
    if (spec.required && (value === undefined || value === null || value === '')) {
      errors.push(`${spec.label} es requerido`)
    }
    
    // Validar tipo number
    if (spec.type === 'number' && value !== undefined && value !== null) {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        errors.push(`${spec.label} debe ser un número`)
      }
      if (spec.min !== undefined && numValue < spec.min) {
        errors.push(`${spec.label} debe ser mayor o igual a ${spec.min}`)
      }
      if (spec.max !== undefined && numValue > spec.max) {
        errors.push(`${spec.label} debe ser menor o igual a ${spec.max}`)
      }
    }
    
    // Validar select
    if (spec.type === 'select' && value && spec.options) {
      if (!spec.options.includes(value)) {
        errors.push(`${spec.label} debe ser una de las opciones válidas`)
      }
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}
