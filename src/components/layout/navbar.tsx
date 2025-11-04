'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Home, Users, LayoutDashboard, UserCircle, DollarSign, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserMenu } from './user-menu'
import { useAuth } from '@/hooks/useAuth'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Edificios', href: '/buildings', icon: Building2 },
  { name: 'Propiedades', href: '/apartments', icon: Home },
  { name: 'Propietarios', href: '/owners', icon: UserCircle },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Pagos', href: '/payments', icon: DollarSign },
  { name: 'Documentos', href: '/documents', icon: FileText },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()

  return (
    <nav className="bg-gradient-to-r from-white to-blue-50 shadow-md border-b border-blue-100 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gestión Inmobiliaria
                </span>
                <span className="text-xs text-gray-500 -mt-1">Sistema Profesional</span>
              </div>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex md:space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side - User Menu */}
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <UserMenu 
                userName={user.name}
                userEmail={user.email}
                isSystemActive={true}
              />
            ) : (
              <div className="text-sm text-gray-500">Cargando...</div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
