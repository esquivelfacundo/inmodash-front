'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  disabled = false,
  className = ''
}: NumberInputProps) {
  const handleIncrement = () => {
    const newValue = value + step
    if (newValue <= max) {
      onChange(newValue)
    }
  }

  const handleDecrement = () => {
    const newValue = value - step
    if (newValue >= min) {
      onChange(newValue)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="h-8 w-8 p-0 bg-slate-800/30 border-white/10 hover:bg-slate-800/50"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center justify-center min-w-[3rem] h-8 px-2 bg-slate-800/30 border border-white/10 rounded text-white text-sm font-medium">
        {value}
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="h-8 w-8 p-0 bg-slate-800/30 border-white/10 hover:bg-slate-800/50"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
