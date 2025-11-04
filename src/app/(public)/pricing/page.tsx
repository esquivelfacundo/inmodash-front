'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  Building2,
  MessageSquare,
  CreditCard,
  BarChart3,
  Calendar,
  FileSignature,
  Bot,
  Shield,
  Globe,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/landing/PublicNavbar';
import { Footer } from '@/components/landing/Footer';

// Definición de tipos
type Feature = {
  name: string;
  included: boolean;
  highlight?: boolean;
};

// Definición de características por plan
const features: Record<string, Feature[]> = {
  basic: [
    { name: 'Gestión de edificios y departamentos', included: true },
    { name: 'Sistema de clientes y garantes', included: true },
    { name: 'Gestión de contratos', included: true },
    { name: 'Galería de imágenes (hasta 10 por propiedad)', included: true },
    { name: 'Dashboard con estadísticas', included: true },
    { name: 'Búsqueda y filtrado avanzado', included: true },
    { name: 'Exportación básica a PDF', included: true },
    { name: 'Notificaciones por email', included: true },
    { name: 'Plantillas de contratos (3 básicas)', included: true },
    { name: 'Soporte por correo electrónico', included: true },
    { name: 'Chatbot con IA', included: false },
    { name: 'Sistema de reservas online', included: false },
    { name: 'Tour virtual 360°', included: false },
    { name: 'Analytics avanzado', included: false },
    { name: 'Notificaciones de pagos automáticas', included: false },
    { name: 'CRM integrado', included: false },
    { name: 'Firma digital de contratos', included: false },
    { name: 'API para desarrolladores', included: false },
  ],
  premium: [
    { name: 'Todo lo del plan Básico', included: true, highlight: true },
    { name: 'Chatbot con IA 24/7', included: true, highlight: true },
    { name: 'Sistema de reservas online', included: true },
    { name: 'Tour virtual 360° para propiedades', included: true },
    { name: 'Analytics y métricas avanzadas', included: true },
    { name: 'Sistema de leads avanzado', included: true },
    { name: 'Email marketing integrado', included: true },
    { name: 'Integración con Google Calendar', included: true },
    { name: 'Galería ilimitada de imágenes', included: true },
    { name: 'Soporte prioritario', included: true },
    { name: 'Notificaciones de pagos automáticas', included: false },
    { name: 'CRM completo', included: false },
    { name: 'Análisis de mercado con IA', included: false },
    { name: 'Firma digital', included: false },
    { name: 'API para desarrolladores', included: false },
  ],
  enterprise: [
    { name: 'Todo lo del plan Premium', included: true, highlight: true },
    { name: 'Sistema de notificaciones de pagos', included: true, highlight: true },
    { name: 'CRM integrado completo', included: true, highlight: true },
    { name: 'Análisis avanzado de mercado con IA', included: true },
    { name: 'Firma digital de contratos', included: true },
    { name: 'Asistente virtual para visitas', included: true },
    { name: 'API REST completa', included: true },
    { name: 'Aplicación móvil nativa', included: true },
    { name: 'Business Intelligence avanzado', included: true },
    { name: 'Seguridad avanzada (2FA, SSO)', included: true },
    { name: 'Multi-tenant y White Label', included: true },
    { name: 'Gestión de mantenimiento', included: true },
    { name: 'Portal del cliente', included: true },
    { name: 'Soporte 24/7 dedicado', included: true },
    { name: 'Onboarding personalizado', included: true },
  ],
};

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    description: 'Perfecto para empezar tu negocio inmobiliario',
    price: 'Gratis',
    priceDetail: 'Para siempre',
    icon: Building2,
    color: 'blue',
    features: features.basic,
    cta: 'Comenzar Gratis',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Para profesionales que buscan crecer',
    price: '$99',
    priceDetail: 'por mes',
    icon: Zap,
    color: 'purple',
    features: features.premium,
    cta: 'Prueba Gratis 14 Días',
    popular: true,
    savings: 'Ahorra 17% con plan anual',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solución completa para empresas',
    price: '$299',
    priceDetail: 'por mes',
    icon: Crown,
    color: 'amber',
    features: features.enterprise,
    cta: 'Contactar Ventas',
    popular: false,
    savings: 'Precio personalizado disponible',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const PricingCard = ({ plan, index }: { plan: typeof plans[0]; index: number }) => {
  const Icon = plan.icon;
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      ring: 'ring-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    purple: {
      gradient: 'from-purple-500 to-pink-600',
      ring: 'ring-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
    },
    amber: {
      gradient: 'from-amber-500 to-orange-600',
      ring: 'ring-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      button: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
    },
  };

  const colors = colorClasses[plan.color as keyof typeof colorClasses];

  return (
    <motion.div
      variants={itemVariants}
      className={`relative flex flex-col h-full rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        plan.popular ? `ring-2 ${colors.ring}` : 'ring-1 ring-gray-200'
      }`}
    >
      {plan.popular && (
        <div className={`absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r ${colors.gradient} text-white text-sm font-semibold shadow-lg`}>
          ⭐ Más Popular
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <Icon className={`h-6 w-6 ${colors.text}`} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{plan.description}</p>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
            {plan.priceDetail && (
              <span className="text-lg text-gray-500">{plan.priceDetail}</span>
            )}
          </div>
          {plan.savings && (
            <p className="mt-2 text-sm text-green-600 font-medium">{plan.savings}</p>
          )}
        </div>

        {/* CTA Button */}
        <button
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${colors.button} shadow-lg hover:shadow-xl`}
        >
          {plan.cta}
        </button>
      </div>

      {/* Features */}
      <div className="px-8 pb-8 flex-1">
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm font-semibold text-gray-900 mb-4">
            Características incluidas:
          </p>
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                {feature.included ? (
                  <Check className={`h-5 w-5 ${feature.highlight ? colors.text : 'text-green-500'} flex-shrink-0 mt-0.5`} />
                ) : (
                  <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'} ${feature.highlight ? 'font-semibold' : ''}`}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white mt-16">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Planes diseñados para tu éxito</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
              Elige tu plan perfecto
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Potencia tu negocio inmobiliario con la plataforma más completa del mercado
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-blue-200'}`}>
                Mensual
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-14 h-7 bg-white/20 rounded-full transition-colors hover:bg-white/30"
              >
                <motion.div
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ x: billingCycle === 'annual' ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-white' : 'text-blue-200'}`}>
                Anual
                <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs">
                  -17%
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full px-4 sm:px-6 lg:px-8 -mt-16 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </motion.div>
      </section>

      {/* Features Highlight */}
      <section className="bg-gray-50 py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Características que impulsan tu negocio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas profesionales diseñadas para maximizar tu productividad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Bot,
                title: 'IA Integrada',
                description: 'Chatbot inteligente que atiende a tus clientes 24/7',
                color: 'purple',
              },
              {
                icon: CreditCard,
                title: 'Pagos Automáticos',
                description: 'Notificaciones y gestión completa de cobranzas',
                color: 'green',
              },
              {
                icon: BarChart3,
                title: 'Analytics Avanzado',
                description: 'Métricas en tiempo real para tomar mejores decisiones',
                color: 'blue',
              },
              {
                icon: FileSignature,
                title: 'Firma Digital',
                description: 'Contratos legalmente válidos en minutos',
                color: 'amber',
              },
              {
                icon: Calendar,
                title: 'Reservas Online',
                description: 'Agenda visitas automáticamente sin llamadas',
                color: 'red',
              },
              {
                icon: Globe,
                title: 'Tour Virtual 360°',
                description: 'Muestra tus propiedades de forma inmersiva',
                color: 'indigo',
              },
              {
                icon: Smartphone,
                title: 'App Móvil',
                description: 'Gestiona tu negocio desde cualquier lugar',
                color: 'pink',
              },
              {
                icon: Shield,
                title: 'Seguridad Total',
                description: 'Encriptación y backups automáticos',
                color: 'gray',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-lg bg-${feature.color}-100 mb-4`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a cientos de profesionales inmobiliarios que ya confían en nosotros
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl flex items-center gap-2 justify-center">
                  Comenzar Gratis
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 justify-center">
                  <MessageSquare className="h-5 w-5" />
                  Hablar con Ventas
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Todo lo que necesitas saber sobre nuestros planes
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: '¿Puedo cambiar de plan en cualquier momento?',
                a: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplicarán inmediatamente y solo pagarás la diferencia prorrateada.',
              },
              {
                q: '¿Hay límite de propiedades en el plan gratuito?',
                a: 'El plan gratuito incluye hasta 50 propiedades. Si necesitas más, puedes actualizar a Premium o Enterprise sin límites.',
              },
              {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos tarjetas de crédito/débito, transferencias bancarias y MercadoPago. Los planes anuales tienen 17% de descuento.',
              },
              {
                q: '¿Ofrecen soporte técnico?',
                a: 'Sí, todos los planes incluyen soporte. El plan Básico tiene soporte por email, Premium incluye soporte prioritario, y Enterprise tiene soporte 24/7 dedicado.',
              },
              {
                q: '¿Puedo cancelar mi suscripción?',
                a: 'Puedes cancelar en cualquier momento sin penalizaciones. Tu plan seguirá activo hasta el final del período pagado.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
