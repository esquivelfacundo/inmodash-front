'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { RegistrationData } from '../multi-step-register'

const representativeSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
  phone: z.string().min(8, 'Teléfono inválido'),
  position: z.string().min(2, 'El cargo es requerido'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type RepresentativeFormData = z.infer<typeof representativeSchema>

interface RepresentativeStepProps {
  data: Partial<RegistrationData>
  updateData: (data: Partial<RegistrationData>) => void
  onNext: () => void
  submitTrigger?: number
}

export function RepresentativeStep({ data, updateData, onNext, submitTrigger }: RepresentativeStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const submitRef = useRef<HTMLButtonElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RepresentativeFormData>({
    resolver: zodResolver(representativeSchema),
    defaultValues: {
      name: data.name || '',
      email: data.email || '',
      password: data.password || '',
      phone: data.phone || '',
      position: data.position || '',
    },
  })

  useEffect(() => {
    if (submitTrigger && submitTrigger > 0) {
      submitRef.current?.click()
    }
  }, [submitTrigger])

  const onSubmit = (formData: RepresentativeFormData) => {
    updateData({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      position: formData.position,
    })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre completo */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
            Nombre Completo *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="Juan Pérez"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-300">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="juan@inmobiliaria.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">
            Teléfono *
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="+54 11 1234-5678"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-300">{errors.phone.message}</p>
          )}
        </div>

        {/* Cargo */}
        <div className="md:col-span-2">
          <label htmlFor="position" className="block text-sm font-medium text-white/90 mb-2">
            Cargo en la Empresa *
          </label>
          <input
            {...register('position')}
            type="text"
            id="position"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="Ej: Director, Gerente, Propietario"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-300">{errors.position.message}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
            Contraseña *
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all pr-12"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
            Confirmar Contraseña *
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all pr-12"
              placeholder="Repite la contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-300">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>
      
      {/* Hidden submit button for external trigger */}
      <button ref={submitRef} type="submit" className="hidden" />
    </form>
  )
}
