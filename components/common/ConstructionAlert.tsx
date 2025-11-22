'use client'

import { Settings, HardHat } from 'lucide-react'

export default function ConstructionAlert() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none select-none w-max max-w-[90vw]">
      <div className="flex items-center gap-3 px-5 py-2.5 bg-yellow-400/70 backdrop-blur-md border border-yellow-200/50 rounded-full shadow-xl text-yellow-950">
        {/* Animasyonlu İkon */}
        <Settings className="w-4 h-4 animate-spin-slow" />

        {/* Metin */}
        <span className="text-sm font-bold tracking-wide whitespace-nowrap">
          BETA SÜRÜM • Geliştirmeler sürüyor
        </span>

        {/* Sabit İkon */}
        <HardHat className="w-4 h-4" />
      </div>
    </div>
  )
}
