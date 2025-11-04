import { UpdateFrequency, UpdatePeriod } from '@/types'

/**
 * Genera períodos de actualización automáticamente basado en fechas y frecuencia
 */
export function generateUpdatePeriods(
  startDate: string,
  endDate: string,
  frequency: UpdateFrequency
): Array<{ date: string; type: 'porcentaje'; value?: number; indexName?: string }> {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const periods: Array<{ date: string; type: 'porcentaje'; value?: number; indexName?: string }> = []
  
  const monthsToAdd = {
    mensual: 1,
    trimestral: 3,
    cuatrimestral: 4,
    semestral: 6,
    anual: 12
  }[frequency]
  
  const currentDate = new Date(start)
  currentDate.setMonth(currentDate.getMonth() + monthsToAdd)
  
  while (currentDate <= end) {
    periods.push({
      date: currentDate.toISOString().split('T')[0],
      type: 'porcentaje',
      value: undefined,
      indexName: undefined
    })
    currentDate.setMonth(currentDate.getMonth() + monthsToAdd)
  }
  
  return periods
}

/**
 * Obtiene el label legible de la frecuencia
 */
export function getFrequencyLabel(frequency: UpdateFrequency): string {
  const labels = {
    mensual: 'Mensual',
    trimestral: 'Trimestral',
    cuatrimestral: 'Cuatrimestral',
    semestral: 'Semestral',
    anual: 'Anual'
  }
  return labels[frequency]
}

/**
 * Calcula el próximo período de actualización
 */
export function getNextUpdatePeriod(periods: UpdatePeriod[]): UpdatePeriod | null {
  const now = new Date()
  const futurePeriods = periods
    .filter(p => new Date(p.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  return futurePeriods[0] || null
}
