import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

interface JobRequest {
  id: string
  request_details: string | null
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | string
  created_at: string
  user_id: string
  provider_id: string
  client_profile: {
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
  } | null
  provider_profile: {
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
  } | null
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-orange-500">Bekliyor</Badge>
    case 'accepted':
      return <Badge className="bg-blue-500">Konuşuluyor</Badge>
    case 'completed':
      return <Badge className="bg-green-500">Anlaşıldı</Badge>
    case 'rejected':
      return <Badge variant="destructive">Reddedildi</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default async function MesajlarPage() {
  const supabase = await createClient()

  // Oturum Kontrolü
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/giris-yap')
  }

  // Kullanıcının dahil olduğu tüm iş taleplerini çek (hem müşteri hem usta olabilir)
  const { data: jobRequests, error } = await supabase
    .from('job_requests')
    .select(
      `
      id,
      request_details,
      status,
      created_at,
      user_id,
      provider_id,
      client_profile:profiles!user_id(first_name, last_name, avatar_url),
      provider_profile:profiles!provider_id(first_name, last_name, avatar_url)
    `
    )
    .or(`user_id.eq.${user.id},provider_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('İş Talebi Çekme Hatası:', error)
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">İş talepleri yüklenirken bir hata oluştu: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const requests: JobRequest[] = (jobRequests || []).map((req: any) => ({
    ...req,
    client_profile: req.client_profile || null,
    provider_profile: req.provider_profile || null,
  }))

  // Karşı tarafın bilgilerini belirle
  const getOtherParty = (request: JobRequest) => {
    if (user.id === request.user_id) {
      // Ben müşteriyim, karşı taraf usta
      return request.provider_profile
    } else {
      // Ben ustayım, karşı taraf müşteri
      return request.client_profile
    }
  }

  const getOtherPartyName = (request: JobRequest) => {
    const otherParty = getOtherParty(request)
    if (!otherParty) return user.id === request.user_id ? 'Usta' : 'Müşteri'
    const name = `${otherParty.first_name || ''} ${otherParty.last_name || ''}`.trim()
    return name || (user.id === request.user_id ? 'Usta' : 'Müşteri')
  }

  const getInitials = (request: JobRequest) => {
    const otherParty = getOtherParty(request)
    if (!otherParty) return '?'
    const first = otherParty.first_name?.[0] || ''
    const last = otherParty.last_name?.[0] || ''
    return `${first}${last}`.toUpperCase() || '?'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mesajlar & Teklifler</h1>
        <p className="text-gray-600 mt-2">
          Tüm iş taleplerinizi ve mesajlaşmalarınızı buradan yönetin
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Henüz bir iş talebiniz yok
              </h3>
              <p className="text-gray-500 mb-4">
                İş talepleri ve mesajlarınız burada görünecek
              </p>
              <Link href="/hizmetler">
                <Button variant="default">Hizmet Ara</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const otherParty = getOtherParty(request)
            return (
              <Card
                key={request.id}
                className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-600 cursor-pointer"
                onClick={() => {
                  // Satıra tıklayınca sohbet sayfasına git
                  window.location.href = `/panel/mesajlar/${request.id}`
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage
                          src={otherParty?.avatar_url || undefined}
                          alt={getOtherPartyName(request)}
                        />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          {getInitials(request)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl truncate">
                          {getOtherPartyName(request)}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(request.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(request.status)}
                      <Link
                        href={`/panel/mesajlar/${request.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="default" size="sm" className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Sohbeti Aç
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {request.request_details || 'Detay belirtilmemiş'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

