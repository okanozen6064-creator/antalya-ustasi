"use client"

import { Hammer, HardHat, Wrench } from "lucide-react"

export function ConstructionAlert() {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Diagonal Construction Band - Sol üstten sağ alta, ekranı kaplıyor */}
      <div 
        className="absolute origin-top-left"
        style={{
          width: '150vw',
          height: '80px',
          transform: 'rotate(-25deg)',
          transformOrigin: 'top left',
          top: '15%',
          left: '-25%',
          background: 'repeating-linear-gradient(45deg, #FACC15 0px, #FACC15 12px, #000 12px, #000 24px)',
          animation: 'diagonalSlide 2.5s linear infinite',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 2px 4px rgba(250,204,21,0.2)',
          borderTop: '3px solid #FACC15',
          borderBottom: '3px solid #000',
        }}
      >
        {/* Content Container - Diagonal içinde */}
        <div className="relative h-full flex items-center justify-center gap-4 px-8" style={{ transform: 'rotate(25deg)' }}>
          {/* Usta Animasyonu - Çekiç Vurma */}
          <div className="flex items-center gap-4">
            {/* Kask */}
            <div className="relative">
              <HardHat className="h-9 w-9 text-yellow-400 drop-shadow-lg" style={{ 
                animation: 'hardHatBounce 2s ease-in-out infinite',
                filter: 'drop-shadow(0 2px 4px rgba(250,204,21,0.5))'
              }} />
            </div>
            
            {/* Çekiç Vurma Animasyonu - Gerçekçi */}
            <div className="relative flex items-end">
              <div className="relative" style={{ transformOrigin: 'bottom center' }}>
                <Hammer 
                  className="h-8 w-8 text-yellow-400 drop-shadow-lg" 
                  style={{
                    transformOrigin: 'bottom center',
                    animation: 'hammerStrike 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                    filter: 'drop-shadow(0 2px 4px rgba(250,204,21,0.5))'
                  }}
                />
                {/* Vuruş efekti - kıvılcım */}
                <div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full blur-sm"
                  style={{
                    animation: 'sparkFlash 1.1s ease-in-out infinite',
                    animationDelay: '0.35s',
                    opacity: 0
                  }}
                />
              </div>
            </div>
            
            {/* İngiliz Anahtarı */}
            <Wrench 
              className="h-7 w-7 text-yellow-400 drop-shadow-lg" 
              style={{ 
                animationDuration: '4s',
                filter: 'drop-shadow(0 2px 4px rgba(250,204,21,0.5))'
              }} 
            />
          </div>
          
          {/* Text Badge */}
          <div className="bg-gradient-to-r from-black/95 via-black/90 to-black/95 backdrop-blur-md px-6 py-2.5 rounded-full border-2 border-yellow-400 shadow-2xl">
            <span className="text-white font-extrabold text-sm md:text-base whitespace-nowrap flex items-center gap-2 tracking-wide">
              <span className="text-2xl animate-pulse" style={{ animationDuration: '1.5s' }}>🚧</span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                DİKKAT: SİTE YAPIM AŞAMASINDADIR
              </span>
              <span className="text-yellow-400">-</span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                USTALAR ÇALIŞIYOR
              </span>
              <span className="text-2xl animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '0.75s' }}>🚧</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

