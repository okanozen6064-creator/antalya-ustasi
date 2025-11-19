import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PageContainer from '@/components/PageContainer'

interface JobRequest {
  id: string
  request_details: string | null
  status: string
  created_at: string
  user_id: string
  provider_id: string
  client: {
    first_name: string | null
    last_name: string | null
    phone: string | null
  } | null
}

export default async function GelenIslerPage() {
  const supabase = await createClient()

  // Session kontrolü
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return (
      <PageContainer>
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Gelen İş Talepleri</h1>
          <p className="text-red-600">Oturum açmanız gerekiyor.</p>
        </div>
      </PageContainer>
    )
  }

  // İş taleplerini çek
  // Önce job_requests'i çek
  const { data: jobRequests, error: jobRequestsError } = await supabase
    .from('job_requests')
    .select('*')
    .eq('provider_id', session.user.id)
    .order('created_at', { ascending: false })

  if (jobRequestsError) {
    console.error('İş talepleri yüklenirken hata:', jobRequestsError)
  }

  // Müşteri bilgilerini çek
  const userIds = (jobRequests || []).map((req) => req.user_id).filter(Boolean)
  let clientProfiles: Record<string, any> = {}

  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, phone')
      .in('id', userIds)

    if (!profilesError && profiles) {
      profiles.forEach((profile) => {
        clientProfiles[profile.id] = profile
      })
    }
  }

  // İş taleplerini client bilgileriyle birleştir
  const requests: JobRequest[] = (jobRequests || []).map((req) => ({
    ...req,
    client: clientProfiles[req.user_id] || null,
  }))

  // Durum badge rengi için fonksiyon
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'bekliyor':
        return 'default'
      case 'accepted':
      case 'kabul edildi':
        return 'secondary'
      case 'completed':
      case 'tamamlandı':
        return 'default'
      case 'rejected':
      case 'reddedildi':
        return 'destructive'
      default:
        return 'default'
    }
  }

  // Durum metni için fonksiyon
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Bekliyor'
      case 'accepted':
        return 'Kabul Edildi'
      case 'completed':
        return 'Tamamlandı'
      case 'rejected':
        return 'Reddedildi'
      default:
        return status || 'Bekliyor'
    }
  }

  return (
    <PageContainer>
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gelen İş Talepleri</h1>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Henüz yeni bir iş talebiniz yok.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="relative">
                <div className="absolute top-4 right-4">
                  <Badge variant={getStatusVariant(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>
                    {request.client?.first_name || ''} {request.client?.last_name || ''}
                  </CardTitle>
                  <CardDescription>
                    {new Date(request.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {request.request_details && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          İş Detayları
                        </p>
                        <p className="text-base text-foreground whitespace-pre-wrap">
                          {request.request_details}
                        </p>
                      </div>
                    )}
                    {request.client?.phone && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Telefon
                        </p>
                        <p className="text-base text-foreground">{request.client.phone}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
