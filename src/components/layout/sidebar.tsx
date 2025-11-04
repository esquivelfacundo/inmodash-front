'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Building2, 
  Home, 
  Users, 
  FileText, 
  DollarSign, 
  FolderOpen,
  Settings,
  LogOut,
  Sparkles,
  User,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Edificios', href: '/buildings', icon: Building2 },
  { name: 'Unidades', href: '/apartments', icon: Home },
  { name: 'Inquilinos', href: '/clients', icon: Users },
  { name: 'Contratos', href: '/contracts', icon: FileText },
  { name: 'Pagos', href: '/payments', icon: DollarSign },
  { name: 'Documentos', href: '/documents', icon: FolderOpen },
];

const secondaryNavigation = [
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-900/90 backdrop-blur-sm text-white hover:bg-gray-800 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:flex-shrink-0
      `}>
        <div className="h-full flex flex-col py-8 px-6 lg:bg-none bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">Inmobiliaria</h1>
              <p className="text-white/60 text-sm">Pro</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

          </nav>

          {/* User Profile and Settings */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-white/60 text-xs truncate">
                  {user?.email || 'usuario@ejemplo.com'}
                </p>
              </div>
            </div>
            
            {/* Settings Button */}
            <Link
              href="/settings"
              onClick={closeMobileMenu}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-2
                ${
                  pathname === '/settings'
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <Settings className="w-5 h-5" />
              Configuración
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
