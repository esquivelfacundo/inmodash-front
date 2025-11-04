'use client'

import { useRouter } from 'next/navigation'
import { DocumentForm } from '@/components/forms/document-form'

export default function NewDocumentPage() {
  const router = useRouter()

  const handleSuccess = (documentId: number) => {
    router.push('/documents')
  }

  const handleCancel = () => {
    router.push('/documents')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Subir Nuevo Documento</h1>
        <p className="text-white/60 mt-2">
          Complete el formulario para subir un nuevo documento al sistema
        </p>
      </div>

      <DocumentForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
