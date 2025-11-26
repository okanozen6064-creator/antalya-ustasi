import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, FileText, Eye, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function PanelDashboardPage() {
  const supabase = await createClient()

  // Kullanıcı bilgilerini çek
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, is_provider')
    .eq('id', session.user.id)
    .single()

  const firstName = profile?.first_name || 'Kullanıcı'
  const isProvider = profile?.is_provider || false

  // Okunmamış mesaj sayısı (job_requests tablosundan pending durumundaki mesajlar)
  const { count: unreadMessages } = await supabase
    .from('job_requests')
    .select('*', { count: 'exact', head: true })
    .or(
      isProvider
        ? `provider_id.eq.${session.user.id},status.eq.pending`
        : `user_id.eq.${session.user.id},status.eq.pending`
    )

  // Aktif teklifler (accepted durumundaki işler)
  const { count: activeOffers } = await supabase
    .from('job_requests')
    .select('*', { count: 'exact', head: true })
    .or(
      isProvider
        ? `provider_id.eq.${session.user.id},status.eq.accepted`
        : `user_id.eq.${session.user.id},status.eq.accepted`
    )

  // Profil görüntülenme sayısı (sadece usta için - bu veri henüz yoksa 0 göster)
  const profileViews = 0 // TODO: İleride analytics tablosu eklendiğinde buraya entegre edilecek

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Hoş geldin, {firstName} {profile?.last_name ? profile.last_name : ''}
        </h1>
        <p className="text-gray-600 mt-2">
          {isProvider
            ? 'Usta panelinize hoş geldiniz. İş taleplerinizi ve mesajlarınızı buradan yönetebilirsiniz.'
            : 'Müşteri panelinize hoş geldiniz. Tekliflerinizi ve mesajlarınızı buradan takip edebilirsiniz.'}
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-indigo-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Okunmamış Mesajlar</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Yeni mesaj ve teklifleriniz
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Teklifler</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOffers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Devam eden iş talepleriniz
            </p>
          </CardContent>
        </Card>

        {isProvider && (
          <Card className="border-l-4 border-l-blue-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profil Görüntülenme</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileViews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Bu ay profil görüntülenme
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Son Aktiviteler veya Yönlendirme */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı Erişim</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-slate-800">Mesajlarınızı Kontrol Edin</h3>
                <p className="text-sm text-gray-600">
                  Yeni mesajlarınızı ve tekliflerinizi görüntüleyin
                </p>
              </div>
              <Link href="/panel/mesajlar">
                <Button variant="default">Mesajlara Git</Button>
              </Link>
            </div>

            {isProvider ? (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-slate-800">Profilinizi Güncelleyin</h3>
                  <p className="text-sm text-gray-600">
                    Profil bilgilerinizi ve hizmetlerinizi düzenleyin
                  </p>
                </div>
                <Link href="/panel/ayarlar">
                  <Button variant="outline">Ayarlara Git</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-slate-800">Hizmet Arayın</h3>
                  <p className="text-sm text-gray-600">
                    İhtiyacınız olan hizmeti bulun ve teklif alın
                  </p>
                </div>
                <Link href="/hizmetler">
                  <Button variant="default" className="gap-2">
                    <Search className="h-4 w-4" />
                    Hizmet Ara
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



