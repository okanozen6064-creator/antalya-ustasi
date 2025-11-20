"use client"

import { useEffect, useState } from "react"
import { Hammer, Wrench, X } from "lucide-react"

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
    <div className="fixed top-0 left-0 right-0 z-[9999] h-12 overflow-hidden">
      {/* Animated Hazard Stripes Background */}
      <div 
        className="absolute inset-0 bg-[length:20px_20px] animate-[hazardSlide_3s_linear_infinite]"
        style={{
          backgroundImage: 'linear-gradient(45deg, #FACC15 25%, #000 25%, #000 50%, #FACC15 50%, #FACC15 75%, #000 75%, #000)'
        }}
      />

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center px-4">
        {/* Badge with text */}
        <div className="bg-black/90 backdrop-blur-sm px-4 py-1.5 rounded-full border-2 border-yellow-400 shadow-lg flex items-center gap-2">
          <span className="text-white font-bold text-sm whitespace-nowrap">
            🚧 DİKKAT: SİTE YAPIM AŞAMASINDADIR - USTALAR ÇALIŞIYOR 🚧
          </span>
          
          {/* Animated Icons */}
          <div className="flex items-center gap-1">
            <Hammer className="h-4 w-4 text-yellow-400 animate-bounce" style={{ animationDelay: '0s', animationDuration: '1s' }} />
            <Wrench className="h-4 w-4 text-yellow-400 animate-spin" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white rounded-full p-1.5 transition-colors shadow-lg z-10"
          aria-label="Uyarıyı kapat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

