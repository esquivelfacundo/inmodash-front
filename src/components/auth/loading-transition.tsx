'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Users, FileText, TrendingUp, Home, Key } from 'lucide-react'

interface LoadingTransitionProps {
  isVisible: boolean
}

const loadingMessages = [
  { icon: Building2, text: 'Preparando tus propiedades' },
  { icon: Users, text: 'Buscando tus inquilinos' },
  { icon: FileText, text: 'Organizando tus contratos' },
  { icon: TrendingUp, text: 'Calculando estadísticas' },
  { icon: Home, text: 'Configurando tu dashboard' },
  { icon: Key, text: 'Verificando accesos' },
]

export function LoadingTransition({ isVisible }: LoadingTransitionProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  const CurrentIcon = loadingMessages[currentMessageIndex].icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-lg"
      >
        <div className="text-center">
          {/* Animated Icon */}
          <motion.div
            key={currentMessageIndex}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl"
          >
            <CurrentIcon className="w-12 h-12 text-white" />
          </motion.div>

          {/* Loading Message */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-white mb-4"
            >
              {loadingMessages[currentMessageIndex].text}
            </motion.h2>
          </AnimatePresence>

          {/* Loading Spinner */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 rounded-full bg-cyan-400"
              />
            ))}
          </div>

          {/* Progress Text */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-6 text-white/70 text-sm"
          >
            Esto solo tomará un momento...
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
