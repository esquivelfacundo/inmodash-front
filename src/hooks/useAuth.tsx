/**
 * Authentication hook for client-side auth state management
 */

'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  companyName?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const router = useRouter();

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      console.log('🔥 Checking auth from domain:', window.location.hostname);
      
      // First try to get user data from backend
      const response = await fetch(`https://inmodash-back-production.up.railway.app/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Auth check successful:', data.user?.email);
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return;
      }
      
      console.log('❌ Backend auth failed, status:', response.status);
      
      // Fallback: Check if we have a valid token in localStorage (mobile compatibility)
      const storedToken = localStorage.getItem('auth-token');
      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          const now = Math.floor(Date.now() / 1000);
          
          if (payload.exp && payload.exp > now) {
            console.log('✅ Using localStorage token as fallback');
            setAuthState({
              user: {
                id: payload.userId,
                email: payload.email,
                name: payload.name || payload.email?.split('@')[0] || 'Usuario',
                role: payload.role,
                companyName: payload.companyName,
                isEmailVerified: true // Assume verified if token is valid
              },
              isLoading: false,
              isAuthenticated: true,
              error: null,
            });
            return;
          } else {
            console.log('🕒 Stored token expired');
            localStorage.removeItem('auth-token');
          }
        } catch (tokenError) {
          console.log('❌ Invalid stored token');
          localStorage.removeItem('auth-token');
        }
      }
      
      // No valid authentication found
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Failed to check authentication status',
      });
    }
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`https://inmodash-back-production.up.railway.app/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Cookies are handled automatically by the browser
        console.log('🔥 Login response data:', data);
        
        // Store token in localStorage as fallback for mobile
        if (data.accessToken) {
          localStorage.setItem('auth-token', data.accessToken);
          console.log('💾 Token saved to localStorage for mobile fallback');
        }
        
        setAuthState({
          user: data.user, // Backend returns data.user, not data.data.user
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return true;
      } else {
        console.log('🔥 Login error response:', data);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.error || data.message || 'Login failed',
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error. Please try again.',
      }));
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await fetch(`https://inmodash-back-production.up.railway.app/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage token and cookies
      localStorage.removeItem('auth-token');
      console.log('🗑️ Cleared localStorage token');
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      router.push('/');
    }
  }, [router]);

  // Register function
  const register = useCallback(async (
    userData: any
  ): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const apiUrl = 'https://inmodash-back-production.up.railway.app';
      console.log('🔥 REGISTRATION ATTEMPT - API URL (hardcoded):', apiUrl);
      console.log('🔥 FULL REGISTRATION URL:', `${apiUrl}/api/auth/register`);
      console.log('🔥 REGISTRATION DATA:', userData);
      console.log('🔥 TIMESTAMP:', new Date().toISOString());
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }

      if (response.ok) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.message || 'Registration failed',
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error. Please try again.',
      }));
      return false;
    }
  }, []);

  // Refresh auth state
  const refreshAuth = useCallback(async (): Promise<void> => {
    await checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check auth on mount only once
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
    refreshAuth,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook for protected routes
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    user,
    isReady: !isLoading && isAuthenticated,
  };
}

// Hook for guest routes (redirect if authenticated)
export function useRequireGuest(redirectTo: string = '/dashboard') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    isReady: !isLoading && !isAuthenticated,
  };
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
) {
  return function AuthenticatedComponent(props: P) {
    const { isReady, user } = useRequireAuth(redirectTo);

    if (!isReady) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Higher-order component for guest routes
export function withGuest<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/dashboard'
) {
  return function GuestComponent(props: P) {
    const { isReady } = useRequireGuest(redirectTo);

    if (!isReady) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
