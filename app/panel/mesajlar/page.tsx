import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PageContainer from '@/components/PageContainer'
import StatusUpdater from '@/components/panel/StatusUpdater'

// İş Talebi tipi
interface JobRequest {
  id: number | string
  request_details: string | null
  description?: string | null // request_details için alias
  status: 'pending' | 'responded' | 'completed' | 'cancelled' | string
  created_at: string
  user_id: string
  provider_id: string
  client_profiles: {
    full_name: string
    phone: string
  } | null
  client?: {
    first_name: string | null
    last_name: string | null
    phone: string | null
  } | null
}

// Status renklerini belirleyen yardımcı fonksiyon
const getStatusBadge = (status: JobRequest['status']) => {
  switch (status) {
    case 'responded':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Yanıtlandı</Badge>
    case 'completed':
      return <Badge className="bg-green-500 hover:bg-green-600">Tamamlandı</Badge>
    case 'cancelled':
      return <Badge variant="destructive">İptal Edildi</Badge>
    case 'pending':
    default:
      return <Badge variant="secondary">Beklemede</Badge>
  }
}

// Tarih formatlama fonksiyonu (date-fns yerine native)
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const months = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day} ${month} ${year} ${hours}:${minutes}`
}

export default async function MessagesPage() {
  const supabase = await createClient()

  // Oturum Kontrolü
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/giris-yap')
  }

  // Sadece bu esnafa ait olan job_requests'leri çek
  // Önce job_requests'i çek
  const { data: jobRequests, error } = await supabase
    .from('job_requests')
    .select('id, request_details, status, created_at, user_id, provider_id')
    .eq('provider_id', user.id) // RLS olsa bile, sunucu tarafında filtreleme önemli
    .order('created_at', { ascending: false })

  if (error) {
    console.error('İş Talebi Çekme Hatası:', error)
    return (
      <PageContainer>
        <div className="p-8">Kanka, iş taleplerini çekerken bir sorun oluştu.</div>
      </PageContainer>
    )
  }

  // Müşteri bilgilerini çek
  const userIds = (jobRequests || []).map((req) => req.user_id).filter(Boolean)
  let clientProfiles: Record<string, { full_name: string; phone: string }> = {}

  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, phone')
      .in('id', userIds)

    if (!profilesError && profiles) {
      profiles.forEach((profile) => {
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Gizli Müşteri'
        clientProfiles[profile.id] = {
          full_name: fullName,
          phone: profile.phone || 'Numara Gizli',
        }
      })
    }
  }

  // İş taleplerini client bilgileriyle birleştir
  const requests: JobRequest[] = (jobRequests || []).map((req) => ({
    ...req,
    description: req.request_details, // Alias
    client_profiles: clientProfiles[req.user_id] || null,
  }))

  const pendingCount = requests?.filter((r) => r.status === 'pending').length || 0

  return (
    <PageContainer>
      <div className="space-y-6 p-4 sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Gelen İş Talepleri 📬</h1>
        <p className="text-muted-foreground">
          Müşterilerin senden istediği işleri buradan takip et ve durumunu güncelle.{' '}
          <span className="font-semibold text-orange-500">
            ({pendingCount} yeni talep bekliyor)
          </span>
        </p>

        <div className="space-y-4">
          {requests && requests.length > 0 ? (
            requests.map((request) => (
              <Card
                key={request.id}
                className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-indigo-500"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl">
                    {request.client_profiles?.full_name || 'Gizli Müşteri'}
                  </CardTitle>
                  <div className="space-x-2 flex items-center">{getStatusBadge(request.status)}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Talep Tarihi:</span>{' '}
                    {formatDate(request.created_at)}
                  </p>

                  <div className="bg-gray-50 p-3 rounded-md border">
                    <p className="font-semibold mb-1 text-gray-700">İş Detayı:</p>
                    <CardDescription className="whitespace-pre-line text-base text-gray-900">
                      {request.request_details || request.description || 'Detay belirtilmemiş'}
                    </CardDescription>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <p className="text-sm font-mono text-gray-600">
                      📞 {request.client_profiles?.phone || 'Numara Gizli'}
                    </p>

                    {/* Status Güncelleyiciyi Client Component olarak buraya yerleştir */}
                    <StatusUpdater initialStatus={request.status} requestId={request.id} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-600">
                Henüz hiç iş talebi almadın kanka.
              </h3>
              <p className="text-muted-foreground mt-2">
                Profil bilgilerinin tam olduğundan emin ol!
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
