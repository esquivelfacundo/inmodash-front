'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, TrendingUp, Users, Zap, Building2 } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-transparent text-white pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">La plataforma inmobiliaria del futuro</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
              Gestiona tu negocio
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                con inteligencia
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              La plataforma todo-en-uno para inmobiliarias modernas. Automatiza, optimiza y crece con IA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 justify-center"
                >
                  Comenzar Gratis
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center gap-2 justify-center"
              >
                <Play className="h-5 w-5" />
                Ver Demo
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: Users, value: '500+', label: 'Clientes activos' },
                { icon: TrendingUp, value: '98%', label: 'Satisfacción' },
                { icon: Zap, value: '40%', label: 'Más productivo' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-200" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Dashboard Mockup - Diseño Real Completo */}
              <div className="bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-white/10">
                {/* Browser Bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="ml-4 h-2 w-32 bg-white/10 rounded" />
                </div>
                
                {/* Dashboard Layout con Sidebar */}
                <div className="flex h-96">
                  {/* Sidebar - Menu Lateral Real (256px) */}
                  <div className="w-48 bg-transparent border-r border-white/10 p-3 flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="h-2 w-16 bg-white/80 rounded mb-1" />
                        <div className="h-1.5 w-8 bg-white/40 rounded" />
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="flex-1 space-y-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((item, i) => (
                        <div 
                          key={item} 
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                            i === 0 
                              ? 'bg-white/10 backdrop-blur-sm' 
                              : 'bg-transparent'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-white/80' : 'bg-white/40'}`} />
                          <div className={`h-1.5 flex-1 rounded ${i === 0 ? 'bg-white/80' : 'bg-white/40'}`} />
                        </div>
                      ))}
                    </div>
                    
                    {/* User Info */}
                    <div className="mt-auto px-2 py-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
                        <div className="flex-1">
                          <div className="h-1.5 w-full bg-white/60 rounded mb-1" />
                          <div className="h-1 w-2/3 bg-white/40 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 p-4 space-y-3 overflow-hidden">
                    {/* Header con título y acciones */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-3 w-32 bg-white/80 rounded mb-1" />
                        <div className="h-2 w-24 bg-white/40 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-white/10" />
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/50" />
                      </div>
                    </div>
                    
                    {/* Stats Cards Grid - 3 columnas */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-white/10">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                            <Building2 className="h-3 w-3 text-blue-400" />
                          </div>
                        </div>
                        <div className="text-lg font-bold text-white">24</div>
                        <div className="h-1.5 w-12 bg-white/20 rounded" />
                      </div>
                      <div className="p-2 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-white/10">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 text-green-400" />
                          </div>
                        </div>
                        <div className="text-lg font-bold text-white">156</div>
                        <div className="h-1.5 w-12 bg-white/20 rounded" />
                      </div>
                      <div className="p-2 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-white/10">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                            <Users className="h-3 w-3 text-purple-400" />
                          </div>
                        </div>
                        <div className="text-lg font-bold text-white">89</div>
                        <div className="h-1.5 w-12 bg-white/20 rounded" />
                      </div>
                    </div>
                    
                    {/* Chart Area Grande */}
                    <div className="p-3 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="h-1.5 w-20 bg-white/40 rounded mb-2" />
                      <div className="flex items-end justify-between h-32 gap-1">
                        {[30, 50, 40, 70, 55, 85, 65, 75, 60, 90, 70, 80].map((height, i) => (
                          <div 
                            key={i} 
                            className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t opacity-80 hover:opacity-100 transition-opacity" 
                            style={{ height: `${height}%` }} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Lista de items recientes */}
                    <div className="space-y-1.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-white/10">
                          <div className="w-6 h-6 rounded bg-blue-500/20" />
                          <div className="flex-1 space-y-1">
                            <div className="h-1.5 w-full bg-white/20 rounded" />
                            <div className="h-1.5 w-2/3 bg-white/10 rounded" />
                          </div>
                          <div className="w-12 h-4 bg-green-500/20 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-6 -right-6 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-xl p-4 w-48 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-sm font-semibold text-white">+32% ventas</span>
                </div>
                <div className="text-xs text-white/60">Este mes</div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -bottom-6 -left-6 bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-xl p-4 w-48 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold text-white">IA Activa</span>
                </div>
                <div className="text-xs text-white/60">Respondiendo clientes</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
