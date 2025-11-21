import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // İş talebini çek
  const { data: jobRequest, error } = await supabase
    .from('job_requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !jobRequest) {
    notFound()
  }

  // Müşteri ve usta bilgilerini çek
  const [clientResult, providerResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone')
      .eq('id', jobRequest.user_id)
      .single(),
    supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone')
      .eq('id', jobRequest.provider_id)
      .single(),
  ])

  const client = clientResult.data
  const provider = providerResult.data

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-500">Bekliyor</Badge>
      case 'accepted':
        return <Badge className="bg-blue-500">Kabul Edildi</Badge>
      case 'completed':
        return <Badge className="bg-green-500">Tamamlandı</Badge>
      case 'rejected':
        return <Badge className="bg-red-500">Reddedildi</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/jobs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İş Talebi Detayı</h1>
          <p className="text-gray-600 mt-1">İş talebi bilgileri ve durumu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Kolon - İş Detayları */}
        <Card>
          <CardHeader>
            <CardTitle>İş Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Durum</label>
              <div className="mt-1">{getStatusBadge(jobRequest.status)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Oluşturulma Tarihi</label>
              <div className="mt-1 text-gray-900">{formatDate(jobRequest.created_at)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">İş Açıklaması</label>
              <div className="mt-1 p-4 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">
                {jobRequest.request_details || 'Açıklama yok'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sağ Kolon - İletişim Bilgileri */}
        <div className="space-y-6">
          {/* Müşteri Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Müşteri Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Ad Soyad</label>
                <div className="mt-1 text-gray-900">
                  {client
                    ? `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'İsimsiz'
                    : 'Bilinmiyor'}
                </div>
              </div>
              {client?.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">E-posta</label>
                  <div className="mt-1 text-gray-900">{client.email}</div>
                </div>
              )}
              {client?.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Telefon</label>
                  <div className="mt-1 text-gray-900">{client.phone}</div>
                </div>
              )}
              {client && (
                <Link href={`/profil/${client.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Müşteri Profilini Gör
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Usta Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>İlgili Usta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Ad Soyad</label>
                <div className="mt-1 text-gray-900">
                  {provider
                    ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'İsimsiz'
                    : 'Bilinmiyor'}
                </div>
              </div>
              {provider?.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">E-posta</label>
                  <div className="mt-1 text-gray-900">{provider.email}</div>
                </div>
              )}
              {provider?.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Telefon</label>
                  <div className="mt-1 text-gray-900">{provider.phone}</div>
                </div>
              )}
              {provider && (
                <Link href={`/profil/${provider.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Usta Profilini Gör
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

