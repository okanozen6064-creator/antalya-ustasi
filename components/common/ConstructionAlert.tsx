"use client"

import { Hammer, Wrench } from 'lucide-react'

export function ConstructionAlert() {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Çapraz Şerit */}
      <div className="relative bg-[#FACC15] w-[200%] py-4 -rotate-12 sm:-rotate-6 md:-rotate-12 lg:-rotate-12 transform shadow-2xl border-y-[6px] border-black flex items-center justify-center opacity-90">
        
        {/* Arka Plan Desen Efekti (Siyah Çizgiler) */}
        <div className="absolute inset-0 opacity-20" 
             style={{
               backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent 100%)',
               backgroundSize: '40px 40px'
             }}
        />

        {/* Kayan Yazı Animasyonu */}
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-black font-black text-xl md:text-3xl uppercase tracking-widest">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Hammer className="w-6 h-6 md:w-8 md:h-8 animate-bounce" />
              <span>SİTE YAPIM AŞAMASINDADIR</span>
              <Wrench className="w-6 h-6 md:w-8 md:h-8 animate-spin-slow" />
              <span>USTALAR ÇALIŞIYOR</span>
              <span className="text-4xl">🚧</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
