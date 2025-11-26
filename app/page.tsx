import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SearchForm } from '@/components/search-form'
import { CategoryCards } from '@/components/category-cards'
import { CheckCircle2, Shield, Star, Zap, DollarSign } from 'lucide-react'
import HowItWorks from '@/components/home/HowItWorks'
import FeaturedPros from '@/components/home/FeaturedPros'
import FadeIn from '@/components/animations/FadeIn'
import InstagramBanner from '@/components/home/InstagramBanner'

// Verileri her seferinde taze çek
export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient()

  // Verileri Çek
  const { data: services } = await supabase
    .from('services')
    .select('id, name, slug')
    .order('name', { ascending: true })

  const { data: districts } = await supabase
    .from('antalya_districts')
    .select('id, name, slug')
    .order('name', { ascending: true })

  return (
    <>
      {/* 1. HERO SECTION (ARAMA ALANI) */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Antalya'nın <span className="text-blue-600">En İyi Ustaları</span>
              <br />
              Bir Arada
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Eviniz, ofisiniz veya aracınız için güvenilir profesyonelleri saniyeler içinde bulun. Ücretsiz teklif alın, karşılaştırın, seçin.
            </p>
          </FadeIn>

          {/* Arama Kartı */}
          <FadeIn delay={0.2}>
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 mb-8">
              <SearchForm services={services || []} districts={districts || []} />
            </div>
          </FadeIn>

          {/* Güven Sinyalleri */}
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Doğrulanmış Profiller
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Hızlı Teklif
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Gerçek Yorumlar
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Pros Section */}
      <FeaturedPros />

      {/* 2. İSTATİSTİK BANDI */}
      <FadeIn delay={0.4}>
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
      </FadeIn>

      {/* 3. NEDEN BİZ? */}
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
      <section id="kategoriler">
        <CategoryCards />
      </section>

      {/* Instagram Banner */}
      <InstagramBanner />
    </>
  )
}
