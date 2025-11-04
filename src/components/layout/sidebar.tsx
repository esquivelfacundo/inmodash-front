'use client';

import React from 'react';
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
  User
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
  const { user } = useAuth();
  
  // Fallback: Get user info from localStorage if not available from context
  const [localUser, setLocalUser] = React.useState<{ name: string; email: string; companyName?: string } | null>(null);
  
  React.useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      if (token) {
        // Decode JWT to get user info (simple base64 decode)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setLocalUser({
            name: payload.name || payload.email?.split('@')[0] || 'Usuario',
            email: payload.email || 'usuario@ejemplo.com',
            companyName: payload.companyName
          });
        } catch (e) {
          console.error('Error decoding token:', e);
        }
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="h-full flex flex-col py-8 px-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">Inmobiliaria</h1>
            <p className="text-white/60 text-xs">Pro</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'text-white bg-white/10 backdrop-blur-sm' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="space-y-1 pt-6">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'text-white bg-white/10 backdrop-blur-sm' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>

          {/* User Info */}
          {(user || localUser) && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {user?.companyName || localUser?.companyName || 'Inmobiliaria'}
                  </p>
                  <p className="text-white/60 text-xs truncate mt-0.5">
                    {user?.name || localUser?.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
