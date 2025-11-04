'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserMenuProps {
  userName?: string
  userEmail?: string
  isSystemActive?: boolean
}

export function UserMenu({ 
  userName = 'Usuario Demo', 
  userEmail = 'usuario@demo.com',
  isSystemActive = true 
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    // Clear auth cookies
    document.cookie = 'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie = 'refresh-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    
    // Redirect to login
    window.location.href = '/login'
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <User className="h-5 w-5 text-white" />
          </div>
          
          {/* User Info */}
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-900">{userName}</span>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isSystemActive ? "bg-green-500" : "bg-red-500"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isSystemActive ? "text-green-600" : "text-red-600"
              )}>
                {isSystemActive ? 'Sistema Activo' : 'Sistema Inactivo'}
              </span>
            </div>
          </div>

          {/* Chevron */}
          <ChevronDown className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200 hidden lg:block",
            isOpen && "rotate-180"
          )} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userEmail}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isSystemActive ? "bg-green-500" : "bg-red-500"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isSystemActive ? "text-green-600" : "text-red-600"
              )}>
                {isSystemActive ? 'Sistema Activo' : 'Sistema Inactivo'}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>Mi Perfil</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
