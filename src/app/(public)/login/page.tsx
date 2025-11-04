'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { loginSchema, type LoginRequest } from '@/lib/auth/validation';
import { PublicNavbar } from '@/components/landing/PublicNavbar';
import { Footer } from '@/components/landing/Footer';
import { LoadingTransition } from '@/components/auth/loading-transition';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return') || '/dashboard';
  const { login: loginUser } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showLoadingTransition, setShowLoadingTransition] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔥 LOGIN ATTEMPT - Using useAuth hook');
      
      const success = await loginUser(data.email, data.password);

      if (success) {
        console.log('🔥 Login successful via useAuth');
        setSuccess('Login successful!');
        setShowLoadingTransition(true);
        
        // Wait longer to ensure cookies are fully set
        setTimeout(() => {
          window.location.href = returnUrl;
        }, 2000);
      } else {
        setError('Invalid credentials. Please try again.');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingTransition isVisible={showLoadingTransition} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <Lock className="h-8 w-8 text-white" />
        </motion.div>
        <h2 className="mt-6 text-3xl font-bold text-white">
          Iniciar Sesión
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Accede a tu cuenta de InmoDash
        </p>
      </div>

      {/* Form */}
      <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-6 bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/10"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300"
              >
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/40" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-300 bg-red-500/20' : 'border-white/20 bg-slate-800/50'
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/40" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-300 bg-red-500/20' : 'border-white/20 bg-slate-800/50'
                  }`}
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/40 hover:text-white/70" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/40 hover:text-white/70" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-400 focus:ring-cyan-500 border-white/20 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Iniciar Sesión'
              )}
            </motion.button>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-white/70">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/register"
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
      </motion.form>
    </motion.div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <PublicNavbar />
      
      <div className="flex items-center justify-center min-h-screen pt-16 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
