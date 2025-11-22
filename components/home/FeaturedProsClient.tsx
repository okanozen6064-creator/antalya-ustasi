'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Star, MapPin } from 'lucide-react'
import FadeIn from '@/components/animations/FadeIn'

interface Provider {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  slug: string | null
  average_rating: number | null
  review_count: number | null
  provider_services?: Array<{
    services?: {
      name: string
    } | null
  } | null
  provider_locations?: Array<{
    antalya_districts?: {
      name: string
    } | null
  } | null
}

interface FeaturedProsClientProps {
  providers: Provider[]
}

export default function FeaturedProsClient({ providers }: FeaturedProsClientProps) {
  const getFullName = (provider: Provider) => {
    return `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'Usta'
  }

  const getServiceName = (provider: Provider) => {
    const services = provider.provider_services || []
    if (services.length > 0 && services[0]?.services?.name) {
      return services[0].services.name
    }
    return 'Usta'
  }

  const getLocation = (provider: Provider) => {
    const locations = provider.provider_locations || []
    if (locations.length > 0 && locations[0]?.antalya_districts?.name) {
      return locations[0].antalya_districts.name
    }
    return null
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              En İyi Ustalar
            </h2>
            <p className="text-lg text-slate-600">
              En yüksek puanlı ve güvenilir ustalarımızla tanışın
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((provider, idx) => {
            const fullName = getFullName(provider)
            const serviceName = getServiceName(provider)
            const location = getLocation(provider)
            const rating = provider.average_rating || 0
            const reviewCount = provider.review_count || 0
            const profileUrl = provider.slug ? `/profil/${provider.slug}` : `/profil/${provider.id}`

            return (
              <FadeIn key={provider.id} delay={idx * 0.15}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <Link href={profileUrl}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                      {provider.avatar_url ? (
                        <Image
                          src={provider.avatar_url}
                          alt={fullName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-4xl font-bold text-indigo-600">
                            {fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Puan Rozeti - Sağ Üst Köşe */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-md">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-slate-900">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      {/* Usta Adı */}
                      <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                        {fullName}
                      </h3>

                      {/* Meslek ve Konum */}
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                        <span className="font-medium">{serviceName}</span>
                        {location && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{location}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Yorum Sayısı */}
                      {reviewCount > 0 && (
                        <p className="text-xs text-slate-500 mb-4">
                          {reviewCount} {reviewCount === 1 ? 'yorum' : 'yorum'}
                        </p>
                      )}

                      {/* Profili İncele Butonu */}
                      <Button
                        variant="outline"
                        className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      >
                        Profili İncele
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

