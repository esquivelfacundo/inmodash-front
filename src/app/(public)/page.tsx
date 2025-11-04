'use client';

import { PublicNavbar, Footer, Hero, Features, Testimonials, CTA } from '@/components/landing';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Zap,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <PublicNavbar />
      
      {/* Hero Section */}
      <Hero />

      {/* Social Proof Section */}
      <section className="py-16 bg-transparent">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-white/60 text-sm font-medium mb-12">
              Tecnología de clase mundial
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center max-w-5xl mx-auto">
              {[
                { name: 'Microsoft', width: 'w-32' },
                { name: 'Google Cloud', width: 'w-36' },
                { name: 'AWS', width: 'w-20' },
                { name: 'Stripe', width: 'w-24' },
                { name: 'OpenAI', width: 'w-28' }
              ].map((company, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-center"
                >
                  <div className={`${company.width} h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300`}>
                    <span className="text-lg font-bold text-white/60">{company.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-transparent">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 mb-4">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold">Cómo Funciona</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Comienza en minutos, no en días
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Configuración simple y rápida para que empieces a trabajar de inmediato
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Crea tu cuenta',
                description: 'Regístrate gratis en menos de 2 minutos. No necesitas tarjeta de crédito.',
              },
              {
                step: '02',
                icon: Building2,
                title: 'Agrega tus propiedades',
                description: 'Importa o crea tus propiedades con nuestro sistema intuitivo.',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Comienza a vender',
                description: 'Activa la IA y automatizaciones para empezar a cerrar más negocios.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-slate-800/40 transition-all duration-300 h-full shadow-xl">
                  <div className="text-6xl font-bold text-white/20 mb-4">
                    {item.step}
                  </div>
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Comparison Section */}
      <section className="py-24 bg-transparent">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Antes vs Después
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Mira cómo nuestra plataforma transforma tu forma de trabajar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 hover:border-red-500/30 transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="inline-flex px-4 py-2 rounded-full bg-red-500/20 text-red-400 font-semibold mb-4">
                  ❌ Antes
                </div>
                <h3 className="text-2xl font-bold text-white">Método Tradicional</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Hojas de cálculo desorganizadas',
                  'Llamadas perdidas de clientes',
                  'Seguimiento manual de pagos',
                  'Contratos en papel',
                  'Sin análisis de datos',
                  'Trabajo repetitivo manual',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/70">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/30 shadow-xl transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="inline-flex px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-semibold mb-4">
                  ✓ Después
                </div>
                <h3 className="text-2xl font-bold text-white">Con Nuestra Plataforma</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Todo centralizado en un solo lugar',
                  'IA responde clientes 24/7',
                  'Notificaciones automáticas de pagos',
                  'Firma digital en minutos',
                  'Analytics y reportes en tiempo real',
                  'Automatización completa',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-white font-medium">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Pricing Preview */}
      <section className="py-24 bg-transparent">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Un plan simple y transparente
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Todo lo que necesitas para gestionar tu negocio inmobiliario
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-10 border border-blue-500/20 hover:border-blue-500/40 shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="inline-flex px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold mb-4">
                    Plan Profesional
                  </div>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-6xl font-bold text-white">$289</span>
                    <span className="text-2xl text-white/60">/mes</span>
                  </div>
                  <p className="text-white/70">Facturación mensual</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    'Propiedades ilimitadas',
                    'Chatbot con IA 24/7',
                    'Analytics avanzado en tiempo real',
                    'Firma digital de contratos',
                    'Gestión automática de pagos',
                    'CRM completo integrado',
                    'Tour virtual 360°',
                    'App móvil iOS y Android',
                    'Soporte prioritario',
                    'API completa',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/pricing">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Comenzar Ahora
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>

                <p className="text-center text-white/60 text-sm mt-6">
                  Prueba gratis por 14 días • Sin tarjeta de crédito
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
