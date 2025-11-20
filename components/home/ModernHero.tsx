'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Zap, Truck, Paintbrush, Snowflake, Droplets, Hammer } from 'lucide-react'

export default function ModernHero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Basitçe hizmetler sayfasına yönlendirip arama parametresi ekleyebiliriz
      // Şimdilik sadece listeye atalım
      router.push(`/kategoriler?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Statik Popüler Kategoriler (Hızlı Erişim İçin)
  const popularCategories = [
    { name: 'Elektrikçi', icon: Zap, slug: 'elektrikci', color: 'text-yellow-500 bg-yellow-100' },
    { name: 'Evden Eve Nakliyat', icon: Truck, slug: 'nakliye', color: 'text-blue-500 bg-blue-100' },
    { name: 'Boya Badana', icon: Paintbrush, slug: 'boyaci', color: 'text-purple-500 bg-purple-100' },
    { name: 'Klima Servisi', icon: Snowflake, slug: 'klima', color: 'text-cyan-500 bg-cyan-100' },
    { name: 'Su Tesisatı', icon: Droplets, slug: 'tesisat', color: 'text-blue-600 bg-blue-50' },
    { name: 'Tadilat', icon: Hammer, slug: 'tadilat', color: 'text-orange-500 bg-orange-100' },
  ]

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Arka Plan Dekoru (Opsiyonel) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-200 blur-[100px]" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-orange-100 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 text-center max-w-5xl">
        {/* 1. Ana Başlık ve Alt Başlık */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          Antalya'nın En İyi Ustaları <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-orange-500">
            Tek Tıkla Kapında
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Evin için gereken tüm hizmetler burada. Güvenilir, onaylı ve yerel esnaflardan ücretsiz teklif al, karşılaştır, işini hallet.
        </p>

        {/* 2. Modern Arama Çubuğu (Tek Input) */}
        <div className="relative max-w-2xl mx-auto mb-12 group">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          <form onSubmit={handleSearch} className="relative flex items-center bg-white rounded-full shadow-xl p-2 border border-slate-100">
            <div className="pl-4 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <Input
              type="text"
              placeholder="Hangi hizmete ihtiyacın var? (Örn: Klima temizliği, Boyacı)"
              className="flex-grow border-none shadow-none focus-visible:ring-0 text-lg h-12 bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="lg"
              className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12"
            >
              BUL
            </Button>
          </form>
        </div>

        {/* 3. Popüler Kategoriler Grid'i */}
        <div className="mt-12">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            Sık Tercih Edilen Hizmetler
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => router.push(`/hizmet/${cat.slug}`)}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={`p-3 rounded-full mb-3 ${cat.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-slate-700 text-sm group-hover:text-indigo-600">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

