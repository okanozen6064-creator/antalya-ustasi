'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'

interface RevealNumberProps {
  phone?: string
  className?: string
}

export function RevealNumber({ phone, className = '' }: RevealNumberProps) {
  const [revealed, setRevealed] = useState(false)
  const originalPhone = phone || '0532 555 44 33' // Veri yoksa placeholder
  
  // Son 4 haneyi gizle
  const maskedPhone = originalPhone.slice(0, -4) + '** **'

  const handleClick = (e: React.MouseEvent) => {
    // Kartın linkine gitmesini engelle
    e.preventDefault()
    e.stopPropagation()
    setRevealed(true)
  }

  if (revealed) {
    return (
      <a
        href={`tel:+90${originalPhone.replace(/\s/g, '')}`}
        onClick={(e) => {
          e.stopPropagation()
        }}
        className={`flex items-center justify-center gap-2 font-bold transition-all rounded-lg bg-green-600 text-white border-green-600 hover:bg-green-700 ${className}`}
      >
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.26-.26.35-.63.24-1.01a17.9 17.9 0 01-.56-3.53.98.98 0 00-1-.98H4.1a.98.98 0 00-.98.98C3.3 14.97 12.03 23.7 21.02 23.7c.54 0 .98-.44.98-.98v-3.86a.98.98 0 00-.98-.98z" />
        </svg>
        <span>Hemen Ara: {originalPhone}</span>
      </a>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 font-bold transition-all rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 ${className}`}
    >
      <Eye className="w-4 h-4 text-gray-500" />
      <span>{maskedPhone} - Göster</span>
    </button>
  )
}
