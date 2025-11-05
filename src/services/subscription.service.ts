const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://inmodash-back-production.up.railway.app'

export interface CreateSubscriptionParams {
  email: string
  plan?: string
  amount?: number
  currency?: string
}

export interface SubscriptionResponse {
  success: boolean
  subscription?: any
  initPoint?: string
  error?: string
}

/**
 * Crear una suscripción en MercadoPago
 */
export async function createSubscription(
  params: CreateSubscriptionParams,
  token: string
): Promise<SubscriptionResponse> {
  try {
    const response = await fetch(`${API_URL}/api/subscriptions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(params),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create subscription',
      }
    }

    return data
  } catch (error) {
    console.error('Error creating subscription:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Obtener la suscripción actual del usuario
 */
export async function getMySubscription(token: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/subscriptions/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.subscription
  } catch (error) {
    console.error('Error getting subscription:', error)
    return null
  }
}

/**
 * Cancelar la suscripción actual
 */
export async function cancelSubscription(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/subscriptions/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return false
  }
}
