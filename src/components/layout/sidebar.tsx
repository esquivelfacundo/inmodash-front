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
  X,
  CreditCard
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
  { name: 'Mi Suscripción', href: '/subscription', icon: CreditCard },
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
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">InmoDash</h1>
            </div>
          </div>
          
          {/* Menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile fullscreen menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Blurred background */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeMobileMenu}
          />
          
          {/* Menu content */}
          <div className="relative h-full w-full overflow-y-auto pt-20 px-6">
            <div className="h-full flex flex-col py-8">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-semibold text-lg">InmoDash</h1>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-full shadow-sm">
                      Premium
                    </span>
                  </div>
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

              {/* Settings and Logout */}
              <div className="mt-8">
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 mb-4"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>

                {/* Company and User Info */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-xs truncate">
                        {user?.companyName || 'Inmobiliaria Propy'}
                      </p>
                      <p className="text-white/70 text-xs truncate">
                        {user?.name || 'Facundo Esquivel'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="h-full flex flex-col py-8 px-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">InmoDash</h1>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 rounded-full shadow-sm">
                  Premium
                </span>
              </div>
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

          {/* Settings and Logout */}
          <div className="mt-8">
            {/* Settings Button */}
            <Link
              href="/settings"
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 mb-4"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>

            {/* Company and User Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-xs truncate">
                    {user?.companyName || 'Inmobiliaria Propy'}
                  </p>
                  <p className="text-white/70 text-xs truncate">
                    {user?.name || 'Facundo Esquivel'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
