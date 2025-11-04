/**
 * API Client with automatic token refresh
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  
  failedQueue = []
}

/**
 * Refresh the access token
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data = await response.json()
    
    // Token is now in httpOnly cookie, no need to store in localStorage
    return true
  } catch (error) {
    console.error('Token refresh failed:', error)
    return false
  }
}

/**
 * Enhanced fetch with automatic token refresh
 */
export async function apiClient(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`
  
  // Get token from localStorage for Express backend
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
  
  // Add credentials to include cookies and Authorization header
  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    let response = await fetch(fullUrl, config)

    // If we get a 401, redirect to login (no auto-refresh to avoid loops)
    if (response.status === 401 && !url.includes('/auth/')) {
      console.warn('Unauthorized request to:', fullUrl)
      // Only redirect once, not for every failed request
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        console.log('Redirecting to login due to 401')
        setTimeout(() => {
          window.location.href = '/login?return=' + encodeURIComponent(window.location.pathname)
        }, 100)
      }
    }

    return response
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

/**
 * Helper methods for common HTTP verbs
 */
export const api = {
  get: (url: string, options?: RequestInit) =>
    apiClient(url, { ...options, method: 'GET' }),
  
  post: (url: string, data?: unknown, options?: RequestInit) =>
    apiClient(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: (url: string, data?: unknown, options?: RequestInit) =>
    apiClient(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: (url: string, options?: RequestInit) =>
    apiClient(url, { ...options, method: 'DELETE' }),
  
  patch: (url: string, data?: unknown, options?: RequestInit) =>
    apiClient(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
}
