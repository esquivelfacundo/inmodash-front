/**
 * useGuarantors Hook
 * React hook for guarantor management with API integration
 */

import { useState, useEffect, useCallback } from 'react'
import { guarantorsService, ApiError } from '@/services'
import { logger } from '@/lib/logger'

// Using types from services
type Guarantor = Awaited<ReturnType<typeof guarantorsService.getByTenantId>>[0]

// Type for guarantor creation without tenantId (handled by hook)
export type CreateGuarantorData = Omit<Parameters<typeof guarantorsService.create>[1], 'tenantId'>

export function useGuarantorsByTenant(tenantId: number) {
  const [guarantors, setGuarantors] = useState<Guarantor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGuarantors = useCallback(async () => {
    if (!tenantId) return
    
    setLoading(true)
    setError(null)
    try {
      const data = await guarantorsService.getByTenantId(tenantId)
      setGuarantors(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al cargar garantes'
      setError(message)
      logger.error('Error fetching guarantors:', err)
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  const createGuarantor = useCallback(async (data: CreateGuarantorData) => {
    if (!tenantId) return
    
    setLoading(true)
    setError(null)
    try {
      const newGuarantor = await guarantorsService.create(tenantId, data)
      setGuarantors(prev => [...prev, newGuarantor])
      return newGuarantor
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al crear garante'
      setError(message)
      logger.error('Error creating guarantor:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [tenantId])

  const deleteGuarantor = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await guarantorsService.delete(id)
      setGuarantors(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al eliminar garante'
      setError(message)
      logger.error('Error deleting guarantor:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGuarantors()
  }, [fetchGuarantors])

  return {
    guarantors,
    loading,
    error,
    refresh: fetchGuarantors,
    createGuarantor,
    deleteGuarantor,
  }
}

export function useGuarantor(id: number) {
  const [guarantor, setGuarantor] = useState<Guarantor | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGuarantor = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    try {
      const data = await guarantorsService.getById(id)
      setGuarantor(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al cargar garante'
      setError(message)
      logger.error('Error fetching guarantor:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchGuarantor()
  }, [fetchGuarantor])

  return {
    guarantor,
    loading,
    error,
    refresh: fetchGuarantor,
  }
}

export function useGuarantors() {
  const [guarantors, setGuarantors] = useState<Guarantor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGuarantors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await guarantorsService.getAll()
      setGuarantors(data)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al cargar garantes'
      setError(message)
      logger.error('Error fetching guarantors:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteGuarantor = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await guarantorsService.delete(id)
      setGuarantors(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al eliminar garante'
      setError(message)
      logger.error('Error deleting guarantor:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGuarantors()
  }, [fetchGuarantors])

  return {
    guarantors,
    loading,
    error,
    refresh: fetchGuarantors,
    deleteGuarantor,
  }
}
