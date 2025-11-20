import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('name, slug')
    .order('name')

  // A-Z Gruplama Fonksiyonu
  const grouped = services?.reduce((acc: any, service) => {
    const char = service.name[0].toLocaleUpperCase('tr-TR')
    if (!acc[char]) acc[char] = []
    acc[char].push(service)
    return acc
  }, {})

  const letters = Object.keys(grouped || {}).sort((a, b) =>
    a.localeCompare(b, 'tr')
  )

  // Popüler Listesi (Manuel Tanımlı)
  const popular = [
    { name: 'Evden Eve Nakliyat', slug: 'evden-eve-nakliyat', icon: '🚚' },
    { name: 'Ev Temizliği', slug: 'ev-temizligi', icon: '✨' },
    { name: 'Elektrikçi', slug: 'elektrikci', icon: '⚡' },
    { name: 'Boyacı', slug: 'boyaci', icon: '🎨' },
    { name: 'Tesisatçı', slug: 'tesisatci', icon: '🔧' },
    { name: 'Oto Tamircileri', slug: 'oto-tamircileri', icon: '🚗' },
    { name: 'Düğün Salonları', slug: 'dugun-salonlari', icon: '💍' },
    { name: 'Kombi & Klima Servisi', slug: 'kombi-klima-servisi', icon: '❄️' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Tüm Hizmet Kategorileri
          </h1>
          <p className="text-lg text-gray-600">
            Eviniz, işiniz ve kendiniz için ihtiyacınız olan her şey burada.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {services?.length || 0} farklı kategoride aradığınız uzmanı bulun
          </p>
        </div>

        {/* Popüler Kategoriler */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🔥 En Çok Arananlar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popular.map((item) => (
              <Link
                href={`/hizmet/${item.slug}`}
                key={item.slug}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group text-center"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="font-bold text-gray-800 group-hover:text-blue-600">
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* A-Z Listesi */}
        <section className="space-y-12">
          {letters.map((letter) => (
            <div
              key={letter}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6 border-b pb-2">
                <span className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center text-2xl font-bold">
                  {letter}
                </span>
                <h3 className="text-gray-400 font-medium uppercase tracking-wider">
                  ile başlayan hizmetler
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {grouped[letter].map((service: any) => (
                  <Link
                    href={`/hizmet/${service.slug}`}
                    key={service.slug}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg transition-colors font-medium text-sm group"
                  >
                    {service.name}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      ➜
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
