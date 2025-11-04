'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

/**
 * PÁGINA DEPRECADA
 * 
 * Los apartamentos se crean automáticamente al crear un edificio.
 * Esta ruta redirige al detalle del edificio.
 */
export default function NewApartmentPage() {
  const params = useParams()
  const router = useRouter()
  const buildingId = params.id as string

  useEffect(() => {
    // Redirigir automáticamente al edificio
    router.push(`/buildings/${buildingId}`)
  }, [buildingId, router])

  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-white/60">Redirigiendo...</p>
      </div>
    </div>
  )
}
