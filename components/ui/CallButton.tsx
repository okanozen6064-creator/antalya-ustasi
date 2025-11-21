'use client'

import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CallButtonProps {
  phoneNumber: string
  className?: string
}

export function CallButton({ phoneNumber, className = '' }: CallButtonProps) {
  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`
  }

  return (
    <Button
      onClick={handleCall}
      className={`h-10 w-10 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white p-0 flex items-center justify-center shadow-md hover:shadow-lg transition-all ${className}`}
      aria-label={`${phoneNumber} numarasını ara`}
    >
      <Phone className="h-5 w-5" />
    </Button>
  )
}

