import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Star, Phone, CheckCircle } from 'lucide-react'
import { CreateJobModal } from '@/components/jobs/CreateJobModal'
import { CallButton } from '@/components/ui/CallButton'
import type { Metadata } from 'next'

// Verileri her seferinde taze çek
export const dynamic = 'force-dynamic'

// Dinamik Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const supabase = await createClient()

  // Ustanın verisini çek
  const { data: providerData, error } = await supabase
    .from('profiles')
    .select(
      `
      first_name,
      last_name,
      average_rating,
      provider_services (
        services (
          name
        )
      ),
      provider_locations (
        antalya_districts (
          name
        )
      )
    `
    )
    .eq('slug', slug)
    .eq('is_provider', true)
    .eq('is_verified', true)
    .maybeSingle()

  // Eğer usta bulunamazsa varsayılan başlık
  if (error || !providerData) {
    return {
      title: 'Usta Bulunamadı | Antalya Ustası',
      description: 'Aradığınız usta bulunamadı.',
    }
  }

  // Ustanın adı
  const fullName = `${providerData.first_name || ''} ${providerData.last_name || ''}`.trim() || 'Usta'

  // Ana hizmeti (İlk hizmeti veya genel "Usta")
  const mainService =
    providerData.provider_services?.[0]?.services?.name || 'Usta'

  // İlçe (İlk ilçesi veya "Antalya")
  const district =
    providerData.provider_locations?.[0]?.antalya_districts?.name || 'Antalya'

  // Puan
  const rating = providerData.average_rating
    ? `${providerData.average_rating.toFixed(1)} Puan`
    : ''

  // Title oluştur
  const titleParts = [fullName, district, mainService]
  if (rating) {
    titleParts.push(rating)
  }
  titleParts.push('Antalya Ustası')
  const title = titleParts.join(' | ')

  // Description oluştur
  const description = `${fullName}, Antalya ${district} bölgesinde ${mainService} hizmeti veriyor. Müşteri yorumlarını oku, hemen ücretsiz teklif iste.`

  return {
    title,
    description,
  }
}

// Yardımcı Fonksiyonlar ve Tipler
interface ClientProfile {
  full_name?: string // Müşteri profillerinde full_name bekliyorduk
  first_name?: string // Loglardan gelen yeni alan
  last_name?: string // Loglardan gelen yeni alan
}

interface Review {
  rating: number
  comment: string
  created_at: string
  // client_profiles artık bir dizi değil, tek bir nesne olmalı (RPC çağrısı single record döndürür)
  // Ancak logda dizi göründüğü için, geçici olarak dizi kabul edelim ve içindeki full_name'i kullanalım.
  // Tip uyuşmazlığını gidermek için, 'client_profiles:client_id' join'inin tek bir nesne döndürdüğünü varsayarak tipi esnetiyoruz:
  client_profiles: ClientProfile | null
}

interface Photo {
  photo_url: string
}

const getAverageRating = (reviews: Review[]): string => {
  if (!reviews || reviews.length === 0) return '0.0'
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return (sum / reviews.length).toFixed(1)
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProfileDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Tek bir sorgu ile tüm ilişkili verileri çekme
  const { data: providerData, error } = await supabase
    .from('profiles')
    .select(
      `
      id,
      first_name,
      last_name,
      bio,
      phone,
      is_verified,
      provider_services (
        services (
          name,
          slug
        )
      ),
      provider_locations (
        antalya_districts (
          name
        )
      ),
      provider_sub_services (
        sub_services (
          name
        )
      ),
      portfolio_photos (
        photo_url
      ),
      reviews (
        rating,
        comment,
        created_at,
        client_profiles:client_id (
          first_name,
          last_name
        )
      )
    `
    )
    .eq('slug', slug)
    .eq('is_provider', true)
    .maybeSingle()

  if (error || !providerData || !providerData.is_verified) {
    // Doğru slug ve Verified olmayan esnafı gösterme
    return notFound()
  }

  const provider = providerData
  // YENİ! Sorgudan çekilen profile verisinde full_name yerine first_name/last_name geldiği varsayılıyor.
  const fullName =
    (provider as any).full_name ||
    `${provider.first_name || ''} ${provider.last_name || ''}`.trim() ||
    'Esnaf'

  // Hatanın olduğu satır: provider.reviews'ın doğru tipe sahip olduğu varsayımıyla devam et.
  // Eğer logda hata veren kısım gerçekten bir diziyse, aşağıdaki satırı kullan:
  const avgRating = getAverageRating((provider.reviews as Review[]) || []) // Tipi zorla

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-10">
        {/* A. Üst Kısım (Hero/Banner) */}
        <Card className="p-6 md:p-10 shadow-xl bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{fullName}</h1>
                {provider.phone && <CallButton phoneNumber={provider.phone} />}
              </div>
              <div className="flex items-center space-x-3 mb-4">
                {/* Doğrulama Rozeti */}
                {provider.is_verified && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" /> Onaylı Usta
                  </Badge>
                )}
                {/* Ortalama Puan */}
                <div className="flex items-center text-lg font-semibold text-orange-500">
                  <Star className="w-5 h-5 fill-orange-500 mr-1" />
                  {avgRating} ({provider.reviews?.length || 0} Yorum)
                </div>
              </div>
            </div>

            {/* Aksiyon Butonları (Sağ Taraf) */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              {/* Numarayı Göster (tel:) */}
              {provider.phone && (
                <Button asChild variant="outline" size="lg" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                  <a href={`tel:${provider.phone}`}>
                    <Phone className="w-5 h-5 mr-2" /> Numarayı Göster
                  </a>
                </Button>
              )}
              {/* Teklif İste (Modal) */}
              <CreateJobModal providerId={provider.id} providerName={fullName} />
            </div>
          </div>
        </Card>

        {/* B & C. İki Kolonlu İçerik Alanı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* B. SOL KOLON (Bilgiler) */}
          <div className="lg:col-span-1 space-y-8 order-2 lg:order-1">
            {/* Hakkında */}
            <Card>
              <CardHeader>
                <CardTitle>Hakkında</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {provider.bio || 'Esnaf henüz kendini tanıtan bir yazı eklemedi.'}
                </p>
              </CardContent>
            </Card>

            {/* Uzmanlıklar ve Hizmet Bölgeleri */}
            <Card>
              <CardHeader>
                <CardTitle>Uzmanlık Alanları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ana Hizmetler */}
                <div>
                  <p className="font-semibold mb-2">Ana Kategoriler:</p>
                  <div className="flex flex-wrap gap-2">
                    {(provider.provider_services || []).map((ps: any, i: number) => (
                      <Badge key={i} variant="default" className="bg-indigo-500 hover:bg-indigo-600">
                        {ps.services?.name || 'Bilinmeyen Hizmet'}
                      </Badge>
                    ))}
                    {(!provider.provider_services || provider.provider_services.length === 0) && (
                      <p className="text-sm text-muted-foreground">Henüz hizmet eklenmemiş.</p>
                    )}
                  </div>
                </div>

                {/* Alt Uzmanlıklar */}
                <div>
                  <p className="font-semibold mb-2">Detaylı Uzmanlıklar:</p>
                  <div className="flex flex-wrap gap-2">
                    {(provider.provider_sub_services || []).map((pss: any, i: number) => (
                      <Badge key={i} variant="outline" className="border-indigo-400 text-indigo-600">
                        {pss.sub_services?.name || 'Bilinmeyen Uzmanlık'}
                      </Badge>
                    ))}
                    {(!provider.provider_sub_services || provider.provider_sub_services.length === 0) && (
                      <p className="text-sm text-muted-foreground">Henüz alt uzmanlık eklenmemiş.</p>
                    )}
                  </div>
                </div>

                {/* Hizmet Bölgeleri */}
                <div>
                  <p className="font-semibold mb-2 mt-4">Hizmet Bölgeleri:</p>
                  <div className="flex flex-wrap gap-2">
                    {(provider.provider_locations || []).map((pl: any, i: number) => (
                      <Badge key={i} variant="secondary">
                        {pl.antalya_districts?.name || 'Bilinmeyen Bölge'}
                      </Badge>
                    ))}
                    {(!provider.provider_locations || provider.provider_locations.length === 0) && (
                      <p className="text-sm text-muted-foreground">Henüz hizmet bölgesi eklenmemiş.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* C. SAĞ KOLON (Kanıtlar: Portfolyo ve Yorumlar) */}
          <div className="lg:col-span-2 space-y-8 order-1 lg:order-2">
            {/* Portfolyo/Galeri */}
            <Card>
              <CardHeader>
                <CardTitle>Yaptığı İşlerden Fotoğraflar</CardTitle>
              </CardHeader>
              <CardContent>
                {provider.portfolio_photos && provider.portfolio_photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {provider.portfolio_photos.slice(0, 6).map((photo: Photo, i: number) => (
                      <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={photo.photo_url}
                          alt={`Portfolyo ${i + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Esnaf henüz portfolyo fotoğrafı eklemedi.</p>
                )}
              </CardContent>
            </Card>

            {/* Müşteri Yorumları */}
            <Card>
              <CardHeader>
                <CardTitle>Gerçek Müşteri Yorumları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {provider.reviews && provider.reviews.length > 0 ? (
                  (provider.reviews as Review[]).map((review: Review, i: number) => {
                    // DÜZELTME: Full name veya first/last name'i birleştirerek kullan
                    const clientName =
                      review.client_profiles?.full_name ||
                      (review.client_profiles?.first_name
                        ? `${review.client_profiles.first_name} ${review.client_profiles.last_name || ''}`.trim()
                        : 'Gizli Müşteri')
                    return (
                      <div key={i} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-orange-500">
                            {[...Array(review.rating)].map((_, j) => (
                              <Star key={j} className="w-4 h-4 fill-orange-500" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, j) => (
                              <Star key={j} className="w-4 h-4 text-gray-300" />
                            ))}
                          </div>
                          <p className="text-sm font-semibold text-gray-700">{clientName}</p>
                        </div>
                        <p className="text-gray-600 italic">"{review.comment}"</p>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-muted-foreground">Bu usta hakkında henüz hiç yorum yapılmamış.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

