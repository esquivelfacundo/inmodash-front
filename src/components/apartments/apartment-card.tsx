import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Apartment, SaleStatus } from '@/types'
import { formatArea } from '@/lib/utils'
import { APARTMENT_STATUS_CONFIG } from '@/lib/constants'
import { Home } from 'lucide-react'

interface ApartmentCardProps {
  apartment: Apartment
  showBuilding?: boolean
}

export function ApartmentCard({ apartment, showBuilding = false }: ApartmentCardProps) {
  const statusConfig = APARTMENT_STATUS_CONFIG[apartment.status]

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                {apartment.nomenclature}
              </CardTitle>
              {showBuilding && apartment.building && (
                <CardDescription className="text-xs mt-1">
                  {apartment.building.name}
                </CardDescription>
              )}
            </div>
          </div>
          <Badge variant={statusConfig.badgeVariant} size="sm">
            {statusConfig.label}
          </Badge>
        </div>
        <CardDescription className="text-xs mt-2 font-mono">
          ID: {apartment.uniqueId}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-600 text-xs mb-1">Ambientes</p>
            <p className="font-semibold text-gray-900">
              {apartment.rooms || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-600 text-xs mb-1">Área</p>
            <p className="font-semibold text-gray-900">
              {apartment.area ? formatArea(apartment.area) : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-600 text-xs mb-1">% Área</p>
            <p className="font-semibold text-blue-600">
              {apartment.areaPercentage}%
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-gray-600 text-xs mb-1">% Ambientes</p>
            <p className="font-semibold text-green-600">
              {apartment.roomPercentage}%
            </p>
          </div>
        </div>

        {apartment.saleStatus === SaleStatus.FOR_SALE && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2.5 flex items-center gap-2">
            <span className="text-lg">🏷️</span>
            <p className="text-xs text-green-800 font-semibold">En Venta</p>
          </div>
        )}

        <Link href={`/apartments/${apartment.id}`} className="block">
          <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors">
            Ver Detalles
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
