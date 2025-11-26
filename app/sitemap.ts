import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://antalyaustasi.com'

  // Base URL'in sonunda / olmamalı
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${cleanBaseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${cleanBaseUrl}/hizmetler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${cleanBaseUrl}/nasil-calisir`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  try {
    const supabase = await createClient()

    // Dinamik Hizmetler: services tablosundaki tüm slug'ları çek
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false })

    const servicePages: MetadataRoute.Sitemap =
      services && !servicesError
        ? services.map((service) => ({
          url: `${cleanBaseUrl}/hizmet/${service.slug}`,
          lastModified: service.updated_at ? new Date(service.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
        : []

    // Dinamik Profiller: profiles tablosundaki (is_provider=true) tüm slug'ları çek
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('slug, updated_at')
      .eq('is_provider', true)
      .eq('is_verified', true)
      .not('slug', 'is', null)
      .order('updated_at', { ascending: false })

    const profilePages: MetadataRoute.Sitemap =
      profiles && !profilesError
        ? profiles.map((profile) => ({
          url: `${cleanBaseUrl}/profil/${profile.slug}`,
          lastModified: profile.updated_at ? new Date(profile.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
        : []

    // Tüm sayfaları birleştir
    return [...staticPages, ...servicePages, ...profilePages]
  } catch (error) {
    console.error('Sitemap oluşturma hatası:', error)
    // Hata durumunda sadece statik sayfaları döndür
    return staticPages
  }
}


