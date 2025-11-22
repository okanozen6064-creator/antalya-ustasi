import { createClient } from '@/lib/supabase/server'
import FeaturedProsClient from './FeaturedProsClient'

export default async function FeaturedPros() {
  const supabase = await createClient()

  // En iyi ustaları çek
  const { data: providers, error } = await supabase
    .from('profiles')
    .select(
      `
      id,
      first_name,
      last_name,
      avatar_url,
      slug,
      average_rating,
      review_count,
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
    .eq('is_provider', true)
    .eq('is_verified', true)
    .not('average_rating', 'is', null)
    .order('average_rating', { ascending: false })
    .limit(4)

  // Hata varsa veya veri yoksa hiçbir şey gösterme
  if (error || !providers || providers.length === 0) {
    return null
  }

  // Veri Dönüştürme (Data Transformation) - Array to Object Fix
  const formattedProviders = (providers || []).map((provider: any) => ({
    ...provider,
    provider_services: provider.provider_services?.map((ps: any) => ({
      ...ps,
      // Eğer services bir dizi ise ilkini al, değilse kendisini al
      services: Array.isArray(ps.services) ? ps.services[0] : ps.services
    })),
    provider_locations: provider.provider_locations?.map((pl: any) => ({
      ...pl,
      // Eğer antalya_districts bir dizi ise ilkini al, değilse kendisini al
      antalya_districts: Array.isArray(pl.antalya_districts) ? pl.antalya_districts[0] : pl.antalya_districts
    }))
  }))

  // Dönüştürülmüş veriyi gönder
  return <FeaturedProsClient providers={formattedProviders} />
}

