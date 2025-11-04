'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  Calendar,
  BarChart3,
  FileSignature,
  CreditCard,
  Globe,
  Smartphone,
  Shield,
  Zap,
  MessageSquare,
  Users,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'Chatbot con IA',
    description: 'Atiende a tus clientes 24/7 con respuestas inteligentes y personalizadas',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: CreditCard,
    title: 'Gestión de Pagos',
    description: 'Notificaciones automáticas, recordatorios y seguimiento de cobranzas',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics Avanzado',
    description: 'Métricas en tiempo real y reportes detallados para tomar mejores decisiones',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileSignature,
    title: 'Firma Digital',
    description: 'Firma contratos de forma electrónica con validez legal completa',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Calendar,
    title: 'Reservas Online',
    description: 'Agenda visitas automáticamente con sincronización de calendarios',
    color: 'red',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    icon: Globe,
    title: 'Tour Virtual 360°',
    description: 'Recorridos inmersivos de propiedades desde cualquier dispositivo',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Smartphone,
    title: 'App Móvil',
    description: 'Gestiona tu negocio desde iOS y Android con todas las funcionalidades',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Seguridad Total',
    description: 'Encriptación, backups automáticos y cumplimiento de normativas',
    color: 'gray',
    gradient: 'from-gray-500 to-slate-500',
  },
  {
    icon: MessageSquare,
    title: 'CRM Integrado',
    description: 'Gestiona clientes, leads y seguimientos en un solo lugar',
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Multi-usuario',
    description: 'Colabora con tu equipo con roles y permisos personalizados',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'Análisis de Mercado',
    description: 'Predicciones de precios y tendencias con inteligencia artificial',
    color: 'lime',
    gradient: 'from-lime-500 to-green-500',
  },
  {
    icon: Zap,
    title: 'Automatización',
    description: 'Workflows automáticos que ahorran tiempo y reducen errores',
    color: 'yellow',
    gradient: 'from-yellow-500 to-amber-500',
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

export const Features = () => {
  return (
    <section className="py-24 bg-slate-800/30">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-cyan-400 mb-4">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">Características Premium</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Herramientas profesionales diseñadas para maximizar tu productividad y ventas
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
