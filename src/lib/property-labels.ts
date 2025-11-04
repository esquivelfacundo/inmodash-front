/**
 * Helper para obtener labels dinámicos según el tipo de propiedad
 */

export const propertyTypeLabels: Record<string, {
  singular: string
  plural: string
  icon: string
}> = {
  casa: {
    singular: 'Casa',
    plural: 'Casas',
    icon: '🏠'
  },
  departamento: {
    singular: 'Departamento',
    plural: 'Departamentos',
    icon: '🏢'
  },
  local: {
    singular: 'Local Comercial',
    plural: 'Locales Comerciales',
    icon: '🏪'
  },
  oficina: {
    singular: 'Oficina',
    plural: 'Oficinas',
    icon: '💼'
  },
  cochera: {
    singular: 'Cochera',
    plural: 'Cocheras',
    icon: '🚗'
  }
}

/**
 * Obtiene el label singular de un tipo de propiedad
 */
export function getPropertyLabel(propertyType: string): string {
  return propertyTypeLabels[propertyType]?.singular || 'Propiedad'
}

/**
 * Obtiene el label plural de un tipo de propiedad
 */
export function getPropertyLabelPlural(propertyType: string): string {
  return propertyTypeLabels[propertyType]?.plural || 'Propiedades'
}

/**
 * Obtiene el ícono de un tipo de propiedad
 */
export function getPropertyIcon(propertyType: string): string {
  return propertyTypeLabels[propertyType]?.icon || '🏠'
}

/**
 * Determina si un tipo de propiedad puede estar en un edificio
 */
export function canBeInBuilding(propertyType: string): boolean {
  return ['departamento', 'oficina', 'cochera'].includes(propertyType)
}

/**
 * Determina si un tipo de propiedad requiere campos de edificio
 */
export function requiresBuildingFields(propertyType: string, isIndependent: boolean): boolean {
  return canBeInBuilding(propertyType) && !isIndependent
}

/**
 * Obtiene el título contextual para la sección de estado
 */
export function getStatusSectionTitle(propertyType: string): string {
  const label = getPropertyLabel(propertyType)
  return `Estado de la ${label}`
}

/**
 * Obtiene el título contextual para la sección de ubicación
 */
export function getLocationSectionTitle(propertyType: string, hasBuilding: boolean): string {
  if (hasBuilding) {
    return 'Edificio'
  }
  return 'Ubicación'
}
