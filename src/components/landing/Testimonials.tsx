'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'María González',
    role: 'Directora de Inmobiliaria Premium',
    company: 'Premium Properties',
    image: '👩‍💼',
    content: 'Desde que implementamos esta plataforma, nuestras ventas aumentaron un 45%. El chatbot con IA es increíble, atiende clientes mientras dormimos.',
    rating: 5,
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Agente Inmobiliario',
    company: 'Rodríguez & Asociados',
    image: '👨‍💼',
    content: 'La automatización de pagos me ahorra 10 horas semanales. Ahora puedo enfocarme en cerrar más negocios en lugar de perseguir pagos.',
    rating: 5,
  },
  {
    name: 'Ana Martínez',
    role: 'CEO',
    company: 'Martínez Propiedades',
    image: '👩‍💻',
    content: 'El sistema de firma digital revolucionó nuestro proceso. Cerramos contratos en minutos en lugar de días. Totalmente recomendado.',
    rating: 5,
  },
  {
    name: 'Jorge López',
    role: 'Gerente de Ventas',
    company: 'López Inmobiliaria',
    image: '👨‍💻',
    content: 'Los analytics nos permiten tomar decisiones basadas en datos reales. Identificamos qué propiedades vender y a qué precio en tiempo real.',
    rating: 5,
  },
  {
    name: 'Laura Fernández',
    role: 'Propietaria',
    company: 'Fernández Real Estate',
    image: '👩',
    content: 'Como propietaria de una pequeña inmobiliaria, esta plataforma me dio herramientas de empresa grande a precio accesible. Excelente inversión.',
    rating: 5,
  },
  {
    name: 'Roberto Silva',
    role: 'Director Comercial',
    company: 'Silva Properties Group',
    image: '👨',
    content: 'El tour virtual 360° nos diferencia de la competencia. Los clientes pueden ver propiedades desde cualquier parte del mundo.',
    rating: 5,
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 mb-4">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold">Testimonios</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Más de 500 profesionales inmobiliarios confían en nuestra plataforma
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{testimonial.image}</div>
                <div>
                  <h3 className="font-bold text-white">{testimonial.name}</h3>
                  <p className="text-sm text-white/70">{testimonial.role}</p>
                  <p className="text-xs text-white/60">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-400/30" />
                <p className="text-white/90 leading-relaxed pl-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '500+', label: 'Clientes Activos' },
            { value: '98%', label: 'Satisfacción' },
            { value: '10K+', label: 'Propiedades Gestionadas' },
            { value: '24/7', label: 'Soporte Disponible' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-white/70 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
