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

  return <FeaturedProsClient providers={providers} />
}

