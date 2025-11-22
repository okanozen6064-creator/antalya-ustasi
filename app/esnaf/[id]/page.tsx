import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { QuoteRequestModal } from '@/components/QuoteRequestModal'
import { ReviewForm } from '@/components/forms/ReviewForm'
import { RevealNumber } from '@/components/ui/RevealNumber'
import { CheckCircle2, MapPin, Clock, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EsnafPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Profil bilgilerini ve ilişkili verileri çek
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(
      `
      *,
      provider_services!inner(
        service:services(id, name, slug)
      ),
      provider_sub_services(
        sub_service:sub_services(id, name)
      ),
      provider_locations(
        district:antalya_districts(id, name, slug)
      ),
      reviews!reviews_provider_id_fkey(rating, comment, created_at, user_id, id)
    `
    )
    .eq('id', id)
    .eq('is_provider', true)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Portfolyo fotoğraflarını çek
  const { data: portfolioPhotos } = await supabase
    .from('portfolio_photos')
    .select('*')
    .eq('provider_id', id)
    .order('created_at', { ascending: false })

  // Verileri düzleştir
  const reviewsList = profile.reviews || []
  const services = (profile.provider_services || []).map((ps: any) => ps.service).filter(Boolean)
  const subServices = (profile.provider_sub_services || []).map((pss: any) => pss.sub_service).filter(Boolean)
  const districts = (profile.provider_locations || []).map((pl: any) => pl.district).filter(Boolean)

  // Ortalama puan hesapla
  const averageRating =
    reviewsList.length > 0
      ? reviewsList.reduce((sum: number, review: any) => sum + review.rating, 0) / reviewsList.length
      : 0

  // Yıldız gösterimi
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <span className="text-yellow-400 text-lg">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </span>
    )
  }

  const userInitials =
    (profile.first_name?.[0] || '') + (profile.last_name?.[0] || '')
  const displayName =
    profile.business_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Bölümü - Kapak Fotoğrafı & Profil */}
      <div className="relative bg-gray-200 h-64 md:h-80">
        {/* Kapak Fotoğrafı Placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>

        {/* Profil Resmi ve Bilgiler */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Profil Resmi */}
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-3xl md:text-4xl bg-blue-600 text-white">
                  {userInitials || 'E'}
                </AvatarFallback>
              </Avatar>

              {/* İsim ve Puan */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{displayName}</h1>
                  {profile.is_verified && (
                    <Badge className="bg-blue-600 text-white px-3 py-1 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Onaylı Esnaf
                    </Badge>
                  )}
                </div>
                {reviewsList.length > 0 && (
                  <div className="flex items-center gap-3">
                    {renderStars(averageRating)}
                    <span className="text-xl font-bold text-gray-900">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({reviewsList.length} {reviewsList.length === 1 ? 'Yorum' : 'Yorum'})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Sütun (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hakkında */}
            <Card>
              <CardHeader>
                <CardTitle>Hakkında</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.bio ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">Henüz biyografi eklenmemiş.</p>
                )}
              </CardContent>
            </Card>

            {/* Uzmanlık Alanları */}
            {subServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uzmanlık Alanları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {subServices.map((subService: any) => (
                      <Badge
                        key={subService.id}
                        variant="secondary"
                        className="px-4 py-2 text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      >
                        🛠️ {subService.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ana Hizmet Kategorileri */}
            {services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hizmet Kategorileri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service: any) => (
                      <Badge key={service.id} variant="outline" className="px-3 py-1">
                        {service.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hizmet Bölgeleri */}
            {districts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Hizmet Bölgeleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {districts.map((district: any) => (
                      <Badge
                        key={district.id}
                        variant="outline"
                        className="px-3 py-1 bg-gray-50"
                      >
                        📍 {district.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Çalışma Saatleri */}
            {profile.working_hours && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Çalışma Saatleri
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{profile.working_hours}</p>
                </CardContent>
              </Card>
            )}

            {/* Portfolyo Galerisi */}
            {portfolioPhotos && portfolioPhotos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolyo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {portfolioPhotos.map((photo: any) => (
                      <div
                        key={photo.id}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <Image
                          src={photo.photo_url}
                          alt={photo.caption || 'Portfolyo fotoğrafı'}
                          fill
                          className="object-cover"
                        />
                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs">
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Yorum Yapma Formu */}
            <ReviewForm providerId={id} />

            {/* Yorumlar */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Yorumlar ({reviewsList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsList.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Henüz yorum yapılmamış. İlk yorumu sen yap!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviewsList.map((review: any) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sağ Sütun (1/3) - Sticky İletişim Kartı */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>İletişim</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Teklif İste Butonu */}
                  <QuoteRequestModal
                    providerId={id}
                    providerName={displayName}
                  />

                  {/* Hemen Ara Butonu - RevealNumber ile */}
                  {profile.phone && (
                    <RevealNumber phone={profile.phone} />
                  )}

                  {/* Güven Verici İkonlar */}
                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Ortalama Cevap Süresi: 15 dk</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>
                        {reviewsList.length > 0
                          ? `${averageRating.toFixed(1)} Puan`
                          : 'Henüz puanlanmamış'}
                      </span>
                    </div>
                    {profile.is_verified && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Doğrulanmış Hesap</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobil Sabit Buton Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50 safe-area-bottom">
        <div className="flex gap-3 max-w-md mx-auto">
          {profile.phone && (
            <div className="flex-1">
              <RevealNumber phone={profile.phone} />
            </div>
          )}
          <div className="flex-1 [&>button]:w-full">
            <QuoteRequestModal providerId={id} providerName={displayName} />
          </div>
        </div>
      </div>
    </main>
  )
}
