import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { QuoteRequestModal } from '@/components/QuoteRequestModal'
import { RevealNumber } from '@/components/ui/RevealNumber'
import type { Metadata } from 'next'

// ÖNBELLEĞİ KAPAT (Her F5'te taze veri çek)
export const dynamic = 'force-dynamic'

// Dinamik Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams

  // Slug'ı düzgün formatla (kebab-case'den normal metne)
  const formatSlug = (slug: string) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const serviceName = formatSlug(slug)

  return {
    title: `${serviceName} Ustaları`,
    description: `Antalya'da ${serviceName.toLowerCase()} hizmeti veren güvenilir ve onaylı ustalar. Ücretsiz teklif alın, en iyi fiyatı bulun.`,
  }
}

export default async function ServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ilce?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()
  const { slug } = resolvedParams
  const ilceSlug = resolvedSearchParams?.ilce

  // VERİ ÇEKME
  let query = supabase
    .from('profiles')
    .select(
      `*,
      provider_services!inner (
        service:services!inner (
          id,
          name,
          slug
        )
      ),
      provider_locations!inner (
        district:antalya_districts!inner (
          id,
          name,
          slug
        )
      ),
      provider_sub_services (
        sub_service:sub_services (
          name
        )
      ),
      reviews (
        rating
      )`
    )
    .eq('is_provider', true)
    .eq('is_verified', true)
    .eq('provider_services.service.slug', slug)

  // İlçe Filtresi Varsa Ekle
  if (ilceSlug) {
    query = query.eq('provider_locations.district.slug', ilceSlug)
  }

  const { data: providers, error } = await query

  // HATA VARSA EKRANA BAS
  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-600 mb-4">Sistem Hatası</h2>
        <p className="text-red-700">
          <strong>Hata Mesajı:</strong> {error.message}
        </p>
      </div>
    )
  }

  // Slug'ı düzgün formatla (kebab-case'den normal metne)
  const formatSlug = (slug: string) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div>
      {/* 1. YENİ ÜST BAŞLIK ALANI (Breadcrumb + Title) */}
      <div className="bg-gray-50 border-b py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600">
              Anasayfa
            </Link>
            <span>/</span>
            <span className="capitalize">{formatSlug(slug)}</span>
            {ilceSlug && (
              <>
                <span>/</span>
                <span className="capitalize text-gray-900 font-bold">
                  {formatSlug(ilceSlug)}
                </span>
              </>
            )}
          </div>

          {/* Başlık ve Sayaç */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 capitalize">
                {ilceSlug
                  ? `${formatSlug(ilceSlug)} ${formatSlug(slug)} Hizmetleri`
                  : `${formatSlug(slug)} Ustaları`}
              </h1>
              <p className="text-gray-600 mt-1">
                Toplam <strong>{providers?.length || 0}</strong> profesyonel sonuç
                bulundu.
              </p>
            </div>

            {/* Mobil İçin Filtre Butonu (İleride Eklenebilir) */}
            <div className="hidden md:block">
              {/* Buraya sıralama vs gelebilir */}
            </div>
          </div>
        </div>
      </div>

      {/* 2. LİSTELEME ALANI */}
      <div className="container mx-auto max-w-5xl py-8 px-4">
        {!providers || providers.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-600">
              Bu kriterlere uygun esnaf bulunamadı.
            </h2>
            <p className="text-gray-500 mt-2">
              Veritabanında kayıt var ama eşleşme olmuyor olabilir.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {providers.map((provider: any) => {
              // Puan hesaplama
              const reviews = provider.reviews || []
              const hasReviews = reviews.length > 0
              const averageRating = hasReviews
                ? reviews.reduce(
                    (sum: number, review: any) => sum + review.rating,
                    0
                  ) / reviews.length
                : 0
              const reviewCount = reviews.length

              return (
                <Link
                  href={`/esnaf/${provider.id}`}
                  key={provider.id}
                  className="block bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all group relative"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* FOTOĞRAF */}
                    <div className="w-full md:w-48 h-48 flex-shrink-0 relative bg-gray-100 rounded-lg overflow-hidden">
                      {/* Avatar Mantığı */}
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 text-4xl font-bold">
                        {provider.first_name?.[0]}
                        {provider.last_name?.[0]}
                      </div>
                    </div>

                    {/* ORTA BİLGİ */}
                    <div className="flex-1 flex flex-col justify-start">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {provider.first_name} {provider.last_name}
                        </h3>
                        {provider.is_verified && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✓ Onaylı
                          </span>
                        )}
                      </div>

                      {/* Puan */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400 text-sm">
                          {'★'.repeat(Math.floor(averageRating || 0))}
                          {'☆'.repeat(5 - Math.floor(averageRating || 0))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {hasReviews
                            ? `${averageRating.toFixed(1)} (${reviewCount} Yorum)`
                            : '(Yeni Üye)'}
                        </span>
                      </div>

                      {/* Konum */}
                      <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                        <span>📍</span>
                        <span className="capitalize">
                          {provider.provider_locations?.[0]?.district?.name ||
                            'Antalya Geneli'}
                        </span>
                      </div>

                      {/* Uzmanlıklar (Badges) */}
                      {provider.provider_sub_services &&
                        provider.provider_sub_services.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {provider.provider_sub_services
                              .slice(0, 4)
                              .map((sub: any, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200"
                                >
                                  {sub.sub_service?.name}
                                </span>
                              ))}
                            {(provider.provider_sub_services?.length || 0) > 4 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{provider.provider_sub_services.length - 4} diğer
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    {/* SAĞ TARAF (AKSİYONLAR) */}
                    <div className="w-full md:w-56 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0 z-20">
                      {/* NUMARAYI GÖSTER (RevealNumber) */}
                      {/* RevealNumber bileşeni zaten e.preventDefault() ve e.stopPropagation() kullanıyor */}
                      {provider.phone && (
                        <RevealNumber
                          phone={provider.phone}
                          className="w-full py-3 shadow-sm border-2 border-green-600/10"
                        />
                      )}

                      {/* TEKLİF İSTE */}
                      <div className="w-full">
                        <QuoteRequestModal
                          providerId={provider.id}
                          providerName={`${provider.first_name || ''} ${provider.last_name || ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
