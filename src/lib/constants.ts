import { ApartmentStatus } from '@/types'

export const APARTMENT_STATUS_CONFIG = {
  [ApartmentStatus.AVAILABLE]: {
    label: 'Disponible',
    color: 'bg-green-100 text-green-800 border-green-200',
    badgeVariant: 'success' as const,
    icon: '✓'
  },
  [ApartmentStatus.RENTED]: {
    label: 'Alquilado',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    badgeVariant: 'info' as const,
    icon: '🏠'
  },
  [ApartmentStatus.UNDER_RENOVATION]: {
    label: 'En Refacción',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    badgeVariant: 'warning' as const,
    icon: '🔧'
  },
  [ApartmentStatus.PERSONAL_USE]: {
    label: 'Uso Propio',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    badgeVariant: 'purple' as const,
    icon: '👤'
  }
}

export const ROUTES = {
  HOME: '/',
  BUILDINGS: '/buildings',
  BUILDING_DETAIL: (id: string) => `/buildings/${id}`,
  BUILDING_NEW: '/buildings/new',
  APARTMENT_DETAIL: (id: string) => `/apartments/${id}`,
  APARTMENT_NEW: (buildingId: string) => `/buildings/${buildingId}/apartments/new`,
  TENANT_NEW: (apartmentId: string) => `/apartments/${apartmentId}/tenants/new`,
  CONTRACT_NEW: (apartmentId: string, tenantId: string) => 
    `/apartments/${apartmentId}/tenants/${tenantId}/contract/new`,
  CLIENTS: '/clients'
}

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}
