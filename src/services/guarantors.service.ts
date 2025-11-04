/**
 * Guarantors Service
 * API calls for guarantor management
 */

import { apiClient } from './api'

export interface Guarantor {
  id: number
  tenantId: number
  name: string
  dni: string
  address: string
  email: string
  phone: string
  createdAt: string
  updatedAt: string
}

export interface CreateGuarantorDto {
  tenantId: number
  name: string
  dni: string
  address: string
  email: string
  phone: string
}

export interface UpdateGuarantorDto {
  name?: string
  dni?: string
  address?: string
  email?: string
  phone?: string
}

export const guarantorsService = {
  /**
   * Get all guarantors
   */
  async getAll(): Promise<Guarantor[]> {
    return apiClient.get<Guarantor[]>('/api/guarantors')
  },

  /**
   * Get guarantors by tenant ID
   */
  async getByTenantId(tenantId: number): Promise<Guarantor[]> {
    return apiClient.get<Guarantor[]>(`/api/guarantors/tenant/${tenantId}`)
  },

  /**
   * Get guarantor by ID
   */
  async getById(id: number): Promise<Guarantor> {
    return apiClient.get<Guarantor>(`/api/guarantors/${id}`)
  },

  /**
   * Create new guarantor for a tenant
   */
  async create(tenantId: number, data: Omit<CreateGuarantorDto, 'tenantId'>): Promise<Guarantor> {
    return apiClient.post<Guarantor>(`/api/guarantors/tenant/${tenantId}`, data)
  },

  /**
   * Update guarantor
   */
  async update(id: number, data: UpdateGuarantorDto): Promise<Guarantor> {
    return apiClient.put<Guarantor>(`/api/guarantors/${id}`, data)
  },

  /**
   * Delete guarantor
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/guarantors/${id}`)
  },
}
