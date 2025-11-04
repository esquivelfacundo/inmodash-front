'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { RegistrationData } from '../multi-step-register'

const companySchema = z.object({
  companyName: z.string().min(3, 'El nombre de la inmobiliaria es requerido'),
  companyTaxId: z.string().min(8, 'CUIT/RUT inválido'),
  companyAddress: z.string().min(5, 'La dirección es requerida'),
  companyCity: z.string().min(2, 'La ciudad es requerida'),
  companyState: z.string().min(2, 'La provincia/estado es requerida'),
  companyCountry: z.string().min(2, 'El país es requerido'),
  companyZipCode: z.string().min(3, 'El código postal es requerido'),
  companyPhone: z.string().min(8, 'El teléfono es requerido'),
  companyWebsite: z.string().url('URL inválida').optional().or(z.literal('')),
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanyStepProps {
  data: Partial<RegistrationData>
  updateData: (data: Partial<RegistrationData>) => void
  onNext: () => void
  onBack: () => void
  submitTrigger?: number
}

export function CompanyStep({ data, updateData, onNext, onBack, submitTrigger }: CompanyStepProps) {
  const submitRef = useRef<HTMLButtonElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: data.companyName || '',
      companyTaxId: data.companyTaxId || '',
      companyAddress: data.companyAddress || '',
      companyCity: data.companyCity || '',
      companyState: data.companyState || '',
      companyCountry: data.companyCountry || 'Argentina',
      companyZipCode: data.companyZipCode || '',
      companyPhone: data.companyPhone || '',
      companyWebsite: data.companyWebsite || '',
    },
  })

  useEffect(() => {
    if (submitTrigger && submitTrigger > 0) {
      submitRef.current?.click()
    }
  }, [submitTrigger])

  const onSubmit = (formData: CompanyFormData) => {
    updateData(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre de la Inmobiliaria */}
        <div className="md:col-span-2">
          <label htmlFor="companyName" className="block text-sm font-medium text-white/90 mb-2">
            Nombre de la Inmobiliaria *
          </label>
          <input
            {...register('companyName')}
            type="text"
            id="companyName"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="Inmobiliaria XYZ S.A."
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-300">{errors.companyName.message}</p>
          )}
        </div>

        {/* CUIT/RUT */}
        <div>
          <label htmlFor="companyTaxId" className="block text-sm font-medium text-white/90 mb-2">
            CUIT/RUT *
          </label>
          <input
            {...register('companyTaxId')}
            type="text"
            id="companyTaxId"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="20-12345678-9"
          />
          {errors.companyTaxId && (
            <p className="mt-1 text-sm text-red-300">{errors.companyTaxId.message}</p>
          )}
        </div>

        {/* Teléfono de la Empresa */}
        <div>
          <label htmlFor="companyPhone" className="block text-sm font-medium text-white/90 mb-2">
            Teléfono de la Empresa *
          </label>
          <input
            {...register('companyPhone')}
            type="tel"
            id="companyPhone"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="+54 11 1234-5678"
          />
          {errors.companyPhone && (
            <p className="mt-1 text-sm text-red-300">{errors.companyPhone.message}</p>
          )}
        </div>

        {/* Dirección */}
        <div className="md:col-span-2">
          <label htmlFor="companyAddress" className="block text-sm font-medium text-white/90 mb-2">
            Dirección *
          </label>
          <input
            {...register('companyAddress')}
            type="text"
            id="companyAddress"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="Av. Corrientes 1234, Piso 5"
          />
          {errors.companyAddress && (
            <p className="mt-1 text-sm text-red-300">{errors.companyAddress.message}</p>
          )}
        </div>

        {/* Ciudad */}
        <div>
          <label htmlFor="companyCity" className="block text-sm font-medium text-white/90 mb-2">
            Ciudad *
          </label>
          <input
            {...register('companyCity')}
            type="text"
            id="companyCity"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="Buenos Aires"
          />
          {errors.companyCity && (
            <p className="mt-1 text-sm text-red-300">{errors.companyCity.message}</p>
          )}
        </div>

        {/* Provincia/Estado */}
        <div>
          <label htmlFor="companyState" className="block text-sm font-medium text-white/90 mb-2">
            Provincia/Estado *
          </label>
          <input
            {...register('companyState')}
            type="text"
            id="companyState"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="CABA"
          />
          {errors.companyState && (
            <p className="mt-1 text-sm text-red-300">{errors.companyState.message}</p>
          )}
        </div>

        {/* País */}
        <div>
          <label htmlFor="companyCountry" className="block text-sm font-medium text-white/90 mb-2">
            País *
          </label>
          <select
            {...register('companyCountry')}
            id="companyCountry"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
          >
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Brasil">Brasil</option>
            <option value="México">México</option>
            <option value="Colombia">Colombia</option>
            <option value="Perú">Perú</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.companyCountry && (
            <p className="mt-1 text-sm text-red-300">{errors.companyCountry.message}</p>
          )}
        </div>

        {/* Código Postal */}
        <div>
          <label htmlFor="companyZipCode" className="block text-sm font-medium text-white/90 mb-2">
            Código Postal *
          </label>
          <input
            {...register('companyZipCode')}
            type="text"
            id="companyZipCode"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="C1001"
          />
          {errors.companyZipCode && (
            <p className="mt-1 text-sm text-red-300">{errors.companyZipCode.message}</p>
          )}
        </div>

        {/* Sitio Web (Opcional) */}
        <div className="md:col-span-2">
          <label htmlFor="companyWebsite" className="block text-sm font-medium text-white/90 mb-2">
            Sitio Web (Opcional)
          </label>
          <input
            {...register('companyWebsite')}
            type="url"
            id="companyWebsite"
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-slate-800/70 transition-all"
            placeholder="https://www.tuinmobiliaria.com"
          />
          {errors.companyWebsite && (
            <p className="mt-1 text-sm text-red-300">{errors.companyWebsite.message}</p>
          )}
        </div>
      </div>
      
      {/* Hidden submit button for external trigger */}
      <button ref={submitRef} type="submit" className="hidden" />
    </form>
  )
}
