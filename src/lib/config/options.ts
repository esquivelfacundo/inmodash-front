/**
 * Opciones para selectores en formularios
 */

export const UPDATE_FREQUENCY_OPTIONS = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral (cada 3 meses)' },
  { value: 'cuatrimestral', label: 'Cuatrimestral (cada 4 meses)' },
  { value: 'semestral', label: 'Semestral (cada 6 meses)' },
  { value: 'anual', label: 'Anual' },
] as const

export const INTEREST_FREQUENCY_OPTIONS = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
] as const

export const UPDATE_TYPE_OPTIONS = [
  { value: 'fijo', label: 'Monto Fijo' },
  { value: 'indice', label: 'Por Índice (IPC, ICL, etc.)' },
  { value: 'porcentaje', label: 'Por Porcentaje' },
] as const

export const APARTMENT_STATUS_OPTIONS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'alquilado', label: 'Alquilado' },
  { value: 'en_refaccion', label: 'En Refacción' },
  { value: 'uso_propio', label: 'Uso Propio' },
] as const

export const SALE_STATUS_OPTIONS = [
  { value: 'en_venta', label: 'En Venta' },
  { value: 'no_esta_en_venta', label: 'No está en venta' },
] as const
