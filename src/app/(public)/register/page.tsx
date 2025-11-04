'use client'

import { MultiStepRegister } from '@/components/auth/multi-step-register'
import ApiTest from '@/components/debug/ApiTest'

export default function RegisterPage() {
  return (
    <div>
      <ApiTest />
      <MultiStepRegister />
    </div>
  )
}
