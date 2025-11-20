"use client"

import { useEffect, useState } from "react"
import { Hammer, Wrench, X, HardHat } from "lucide-react"

export function ConstructionAlert() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // localStorage'dan kontrol et
    const isDismissed = localStorage.getItem("construction-alert-dismissed")
    
    if (!isDismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    // localStorage'a kaydet
    localStorage.setItem("construction-alert-dismissed", "true")
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-2xl h-16 overflow-hidden">
      {/* Animated Hazard Stripes Background - 2x denser */}
      <div 
        className="absolute inset-0 bg-[length:10px_10px] animate-[hazardSlide_2s_linear_infinite]"
        style={{
          backgroundImage: 'linear-gradient(45deg, #FACC15 25%, #000 25%, #000 50%, #FACC15 50%, #FACC15 75%, #000 75%, #000)'
        }}
      />

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center px-4">
        {/* Badge with text */}
        <div className="bg-black/95 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-yellow-400 shadow-2xl flex items-center gap-3">
          {/* Usta Animasyonu - HardHat */}
          <div className="flex items-center gap-2">
            <HardHat className="h-6 w-6 text-yellow-400 animate-bounce" style={{ animationDelay: '0s', animationDuration: '1.2s' }} />
            <div className="flex items-center gap-1">
              <Hammer className="h-5 w-5 text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1s' }} />
              <Wrench className="h-5 w-5 text-yellow-400 animate-spin" style={{ animationDuration: '2s' }} />
            </div>
          </div>
          
          <span className="text-white font-bold text-base whitespace-nowrap">
            🚧 DİKKAT: SİTE YAPIM AŞAMASINDADIR - USTALAR ÇALIŞIYOR 🚧
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white rounded-full p-2 transition-colors shadow-lg z-10"
          aria-label="Uyarıyı kapat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

