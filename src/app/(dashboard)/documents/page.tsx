'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Download, Trash2, Edit } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { useDocuments } from '@/hooks/useDocuments'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function DocumentsPage() {
  const router = useRouter()
  const { documents, loading, deleteDocument } = useDocuments()

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'dni': 'DNI',
      'recibo_sueldo': 'Recibo de Sueldo',
      'contrato': 'Contrato',
      'garantia': 'Garantía',
      'otro': 'Otro'
    }
    return types[type] || type
  }

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'dni': 'bg-blue-500/20 text-blue-300',
      'recibo_sueldo': 'bg-green-500/20 text-green-300',
      'contrato': 'bg-purple-500/20 text-purple-300',
      'garantia': 'bg-orange-500/20 text-orange-300',
      'otro': 'bg-slate-800/50 text-white'
    }
    return colors[type] || 'bg-slate-800/50 text-white'
  }

  const handleDelete = async (id: number, fileName: string) => {
    if (confirm(`¿Está seguro de eliminar el documento "${fileName}"?`)) {
      try {
        await deleteDocument(id)
      } catch (error) {
        // Error already handled in hook
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  if (loading) {
    return <Loading size="lg" text="Cargando documentos..." />
  }

  const documentsByType = documents.reduce((acc, doc) => {
    const type = doc.type || 'otro'
    if (!acc[type]) acc[type] = []
    acc[type].push(doc)
    return acc
  }, {} as Record<string, typeof documents>)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Documentos</h1>
          <p className="text-white/60 mt-2">
            Gestiona todos los documentos del sistema
          </p>
        </div>
        <Link href="/documents/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Subir Documento
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DNIs</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {documentsByType['dni']?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {documentsByType['contrato']?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garantías</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {documentsByType['garantia']?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Documentos</CardTitle>
          <CardDescription>
            Lista completa de documentos subidos al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No hay documentos
              </h3>
              <p className="text-white/60 mb-4">
                Comienza subiendo tu primer documento
              </p>
              <Link href="/documents/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Documento
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-white/90">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold text-white/90">Archivo</th>
                    <th className="text-left py-3 px-4 font-semibold text-white/90">Descripción</th>
                    <th className="text-left py-3 px-4 font-semibold text-white/90">Tamaño</th>
                    <th className="text-left py-3 px-4 font-semibold text-white/90">Asociado a</th>
                    <th className="text-left py-3 px-4 font-semibold text-white/90">Fecha</th>
                    <th className="text-right py-3 px-4 font-semibold text-white/90">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document) => (
                    <tr key={document.id} className="border-b hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <Badge className={getDocumentTypeColor(document.type)}>
                          {getDocumentTypeLabel(document.type)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{document.fileName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/60">
                        {document.description || '-'}
                      </td>
                      <td className="py-3 px-4 text-white/60">
                        {formatFileSize(document.fileSize)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {document.tenant && (
                            <div className="text-white/60">
                              Inquilino: {document.tenant.nameOrBusiness}
                            </div>
                          )}
                          {document.owner && (
                            <div className="text-white/60">
                              Propietario: {document.owner.name}
                            </div>
                          )}
                          {document.contract && (
                            <div className="text-white/60">
                              Contrato #{document.contract.id}
                            </div>
                          )}
                          {document.apartment && (
                            <div className="text-white/60">
                              Depto: {document.apartment.nomenclature}
                            </div>
                          )}
                          {!document.tenant && !document.owner && !document.contract && !document.apartment && (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/60">
                        {format(new Date(document.uploadedAt), 'dd/MM/yyyy', { locale: es })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(document.fileUrl, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(document.id, document.fileName)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
