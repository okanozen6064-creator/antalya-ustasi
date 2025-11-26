'use client'

import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function InstagramBanner() {
    return (
        <section className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <Instagram className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        <span className="text-lg md:text-2xl font-bold text-white tracking-tight">
                            Bizi Instagram'da Takip Edin, Fırsatları Kaçırmayın! @antalyaustasi
                        </span>
                    </div>

                    <Link
                        href="https://instagram.com/antalyaustasi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-pink-600 hover:bg-gray-50 font-bold py-2.5 px-6 rounded-full transition-colors shadow-lg text-sm md:text-base whitespace-nowrap"
                    >
                        Takip Et
                    </Link>
                </div>
            </div>
        </section>
    )
}
