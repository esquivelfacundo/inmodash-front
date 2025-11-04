export interface Building {
  id: number
  name: string
  address: string
  province: string
  city: string
  owner: string
  floors: number
  totalArea: number
  createdAt: Date
  updatedAt: Date
  floorConfiguration: FloorConfiguration[]
  apartments: Apartment[]
  floorPlans?: FloorPlan[]
}

export interface FloorConfiguration {
  floor: number
  apartmentsCount: number
}

export interface RentalHistory {
  id: number
  contractId: number
  tenantId: number
  tenantName: string
  startDate: Date
  endDate: Date
  initialAmount: number
  finalAmount?: number // Último monto pagado
}

export interface Owner {
  id: number
  name: string
  dniOrCuit: string
  phone: string
  email: string
  address: string
  bankAccount?: string
  commissionPercentage: number
  createdAt: Date
  updatedAt: Date
  apartments?: Apartment[]
}

export interface Apartment {
  id: number
  uniqueId: string // Generated ID like N13C100001
  // Campos de edificio (opcionales para departamentos independientes)
  buildingId?: number
  building?: Building
  floor?: number
  apartmentLetter?: string
  nomenclature: string
  // Campos para departamentos independientes
  fullAddress?: string
  city?: string
  province?: string
  // Propietario
  ownerId?: number
  owner?: Owner
  // Tipo de propiedad
  propertyType: PropertyType
  // Información general
  area: number // in square meters
  rooms: number
  areaPercentage: number // Calculated automatically
  roomPercentage: number // Calculated automatically
  status: ApartmentStatus
  saleStatus: SaleStatus
  // Especificaciones adicionales
  specifications?: string // JSON string
  createdAt: Date
  updatedAt: Date
  floorPlans?: FloorPlan[]
  rentalHistory?: RentalHistory[] // Historial de alquileres
}

export interface FloorPlan {
  id: number
  name: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: Date
  buildingId?: number
  apartmentId?: number
}

export enum ApartmentStatus {
  RENTED = 'alquilado',
  AVAILABLE = 'disponible',
  UNDER_RENOVATION = 'en_refaccion',
  PERSONAL_USE = 'uso_propio'
}

export enum SaleStatus {
  FOR_SALE = 'en_venta',
  NOT_FOR_SALE = 'no_esta_en_venta'
}

export enum PropertyType {
  APARTMENT = 'departamento',
  HOUSE = 'casa',
  DUPLEX = 'duplex',
  PH = 'ph',
  OFFICE = 'oficina',
  COMMERCIAL = 'local_comercial',
  PARKING = 'cochera',
  WAREHOUSE = 'deposito',
  LAND = 'terreno'
}

// Form types
export interface BuildingFormData {
  name: string
  address: string
  province: string
  city: string
  owner: string
  floors: number
  floorConfiguration: FloorConfiguration[]
  totalArea: number
}

export interface ApartmentFormData {
  buildingId: number
  floor: number
  apartmentLetter: string
  area: number
  rooms: number
  status: ApartmentStatus
  saleStatus: SaleStatus
  nomenclature: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Payment & contract types
export type UpdateRuleType = 'fijo' | 'indice' | 'porcentaje'
export type UpdateFrequency = 'mensual' | 'trimestral' | 'cuatrimestral' | 'semestral' | 'anual'
export type InterestFrequency = 'diario' | 'semanal' | 'mensual'

export interface UpdatePeriod {
  date: Date // Fecha de actualización
  type: UpdateRuleType
  value?: number // Porcentaje o valor fijo según el tipo
  indexName?: string // Nombre del índice si type es 'indice'
}

export interface LateInterestConfig {
  percent: number // Porcentaje de interés
  frequency: InterestFrequency // Frecuencia de aplicación
}

export interface PaymentUpdateRule {
  updatePeriods: UpdatePeriod[] // Períodos de actualización
  updateFrequency: UpdateFrequency // Frecuencia de actualización (mensual, trimestral, etc.)
  monthlyCoefficient?: number // Coeficiente x mes (si aplica)
  lateInterest?: LateInterestConfig // Configuración de interés por mora
}

export interface PaymentPlan {
  initialAmount: number
  updateRule: PaymentUpdateRule
}

export interface Payment {
  id: number
  contractId: number
  month: Date
  amount: number
  commissionAmount: number
  ownerAmount: number
  paymentDate?: Date
  status: PaymentStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
  contract?: Contract
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

// Dashboard statistics
export interface DashboardStats {
  totalBuildings: number
  totalApartments: number
  availableApartments: number
  rentedApartments: number
  apartmentsForSale: number
  totalArea: number
  totalTenants: number
  totalOwners: number
  activeContracts: number
  independentApartments: number
  totalPayments: number
  pendingPayments: number
  overduePayments: number
  paidThisMonth: number
  totalRevenue: number
  totalCommissions: number
  pendingAmount: number
}

// People & document types
export interface ContactPerson {
  name: string
  phone: string
  email: string
  address: string
}

export type DocumentType = 'dni' | 'recibo_sueldo' | 'contrato' | 'garantia' | 'otro'

export interface Document {
  id: number
  type: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  description?: string
  uploadedAt: Date
  tenantId?: number
  ownerId?: number
  contractId?: number
  apartmentId?: number
  tenant?: Tenant
  owner?: Owner
  contract?: Contract
  apartment?: Apartment
}

export interface Tenant {
  id: number
  nameOrBusiness: string // Nombre o razón social
  dniOrCuit: string // DNI / CUIT
  address: string // Dirección del cliente
  contactName: string // Persona de contacto - nombre
  contactPhone: string // Persona de contacto - teléfono
  contactEmail: string // Persona de contacto - email
  contactAddress: string // Persona de contacto - dirección
  createdAt: Date
  updatedAt: Date
  documents?: Document[]
  guarantors?: Guarantor[] // Garantes asociados a este cliente específico
}

export interface Guarantor {
  id: number
  tenantId: number // ID del cliente al que pertenece este garante
  name: string
  dni: string
  address: string
  email: string
  phone: string
  createdAt: Date
  updatedAt: Date
  documents?: Document[]
}

export interface Contract {
  id: number
  apartmentId: number
  tenantId: number
  startDate: Date
  endDate: Date
  initialAmount: number
  createdAt: Date
  updatedAt: Date
  apartment?: Apartment
  tenant?: Tenant
  updateRule?: UpdateRule
  guarantors?: ContractGuarantor[]
  documents?: Document[] // Contrato y anexos
}

export interface UpdateRule {
  id: number
  contractId: number
  updateFrequency: UpdateFrequency
  monthlyCoefficient?: number
  lateInterestPercent?: number
  lateInterestFrequency?: InterestFrequency
  updatePeriods: UpdatePeriod[]
}

export interface ContractGuarantor {
  contractId: number
  guarantorId: number
  contract?: Contract
  guarantor?: Guarantor
}
