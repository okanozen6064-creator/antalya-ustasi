import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CategoryCards } from '@/components/category-cards'
import { Shield, Star, Zap, DollarSign } from 'lucide-react'
import { SearchFormModern } from '@/components/home/SearchFormModern'
import { redirect } from 'next/navigation'

// Verileri her seferinde taze çek
export const dynamic = 'force-dynamic'

// Veritabanı tipleri
type Service = { id: number; name: string; slug: string }
type District = { id: number; name: string }

// Server Action: Filtreleme ve Yönlendirme
async function filterAndRedirect(formData: FormData) {
  'use server'

  const selectedServiceSlug = formData.get('service') as string
  // FormData.getAll() ile birden fazla ilçe ID'si al
  const selectedDistrictIds = formData.getAll('district') as string[]

  // Yönlendirme Mantığı
  if (selectedServiceSlug && selectedServiceSlug !== '0') {
    let url = `/hizmet/${selectedServiceSlug}`

    if (selectedDistrictIds && selectedDistrictIds.length > 0) {
      // Çoklu ID'leri virgülle birleştirip query param olarak gönder
      const districtQuery = selectedDistrictIds.join(',')
      url += `?ilce=${districtQuery}`
    }

    redirect(url)
  }

  redirect('/kategoriler')
}

export default async function Home() {
  const supabase = await createClient()

  // Veritabanı çekimi
  const [{ data: services }, { data: districts }] = await Promise.all([
    supabase.from('services').select('id, name, slug').order('name', { ascending: true }),
    supabase.from('antalya_districts').select('id, name').order('name', { ascending: true }),
  ])

  const safeServices = services || []
  const safeDistricts = districts || []

  return (
    <>
      {/* 1. HERO SECTION (ARAMA ALANI) */}
      <section className="bg-white py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Başlıklar */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Antalya'nın Güvenilir Ustası Elinin Altında
            </h1>
            <p className="text-xl text-slate-500">
              İhtiyacın olan hizmeti ve bölgeyi seç, en iyi profesyonelleri listele.
            </p>
          </div>

          {/* İKİLİ FİLTRELEME FORMU - GÜNCELLENMİŞ TASARIM */}
          <SearchFormModern
            services={safeServices}
            districts={safeDistricts}
            filterAction={filterAndRedirect}
          />

          {/* Ek Bilgi Çubuğu */}
          <div className="text-center mt-6 text-sm text-slate-500">
            <span className="font-semibold text-green-600">✓ Gerçek Yorumlar</span>
            <span className="mx-4">|</span>
            <span className="font-semibold text-orange-600">✓ Fiyat Garantisi</span>
          </div>
        </div>
      </section>

      {/* 2. İSTATİSTİK BANDI */}
      <div className="bg-white border-y border-gray-100 py-10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">1.500+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Kayıtlı Esnaf</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">89</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Farklı Kategori</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">19</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">İlçe Kapsamı</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">%100</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NASIL ÇALIŞIR? (GRAFİKSEL ANLATIM) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nasıl Çalışır?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Antalya Ustası ile aradığınız hizmete ulaşmak sadece 3 adım.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Bağlantı Çizgisi (Sadece Desktop) */}
            <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-gray-200 -z-10"></div>

            {/* Adım 1 */}
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold border-4 border-white">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Hizmeti Seç</h3>
              <p className="text-gray-500">
                İhtiyacınız olan kategoriyi ve bulunduğunuz ilçeyi seçerek arama yapın.
              </p>
            </div>

            {/* Adım 2 */}
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold border-4 border-white">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Karşılaştır</h3>
              <p className="text-gray-500">
                Listelenen onaylı ustaların profillerini, yorumlarını ve puanlarını inceleyin.
              </p>
            </div>

            {/* Adım 3 */}
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold border-4 border-white">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Teklif Al & Anlaş</h3>
              <p className="text-gray-500">
                Teklif iste butonunu kullanın veya ustayı direkt arayarak işinizi halledin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEDEN BİZ? */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Neden Antalya Ustası?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Güvenilir ve Onaylı Esnaf</h4>
                    <p className="text-gray-500">
                      Sisteme kayıtlı tüm esnaflarımız kimlik doğrulaması ve ön elemeden geçer.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Hızlı ve Kolay Çözüm</h4>
                    <p className="text-gray-500">
                      Saatlerce usta aramak yok. İhtiyacınız olan hizmeti seçin, en yakın ustayı anında bulun.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Ücretsiz Teklif İmkanı</h4>
                    <p className="text-gray-500">
                      İşiniz için birden fazla esnaftan fiyat teklifi alabilir, bütçenize en uygun olanı seçebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Taraf: Canlı Google Harita */}
            <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d203663.6737457775!2d30.52283477896376!3d36.91737656588634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c39aaeddadadc1%3A0x95c69f73f9e32e33!2sAntalya!5e0!3m2!1str!2str!4v1715000000000!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
              ></iframe>

              {/* Üstündeki Etiket */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 animate-pulse">
                    📍
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Hizmet Bölgesi</p>
                    <p className="text-sm font-extrabold text-gray-900">Tüm Antalya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA (ÇAĞRI) ALANI */}
      <section className="bg-blue-600 py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Siz de Hizmet Veriyor musunuz?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Binlerce müşteriye ulaşmak ve işinizi büyütmek için hemen Antalya Ustası'na katılın. Üyelik ücretsizdir.
          </p>
          <Link
            href="/kayit-ol"
            className="inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            HEMEN ESNAF OL
          </Link>
        </div>
      </section>

      {/* Category Cards Section */}
      <CategoryCards />
    </>
  )
}
