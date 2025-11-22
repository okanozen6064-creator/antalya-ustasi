import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { ChatViewButton } from '@/components/admin/ChatViewButton'

export const dynamic = 'force-dynamic'

interface JobRequest {
  id: string
  request_details: string
  status: string
  created_at: string
  user_id: string
  provider_id: string
  client_name?: string
  provider_name?: string
}

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  const statusFilter = resolvedSearchParams?.status

  // İş taleplerini çek
  let query = supabase
    .from('job_requests')
    .select('id, request_details, status, created_at, user_id, provider_id')
    .order('created_at', { ascending: false })

  // Durum filtresi
  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  const { data: jobRequests, error } = await query

  if (error) {
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

  // Müşteri ve usta bilgilerini çek
  const userIds = [...new Set((jobRequests || []).map((job) => job.user_id).filter(Boolean))]
  const providerIds = [...new Set((jobRequests || []).map((job) => job.provider_id).filter(Boolean))]

  let clientProfiles: Record<string, string> = {}
  let providerProfiles: Record<string, string> = {}

  if (userIds.length > 0) {
    const { data: clients } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', userIds)

    if (clients) {
      clients.forEach((client) => {
        const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'İsimsiz'
        clientProfiles[client.id] = fullName
      })
    }
  }

  if (providerIds.length > 0) {
    const { data: providers } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', providerIds)

    if (providers) {
      providers.forEach((provider) => {
        const fullName = `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'İsimsiz'
        providerProfiles[provider.id] = fullName
      })
    }
  }

  // İş taleplerini client ve provider bilgileriyle birleştir
  const jobs: JobRequest[] = (jobRequests || []).map((job) => ({
    ...job,
    client_name: clientProfiles[job.user_id] || 'Bilinmeyen Müşteri',
    provider_name: providerProfiles[job.provider_id] || 'Bilinmeyen Usta',
  }))

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İş Talepleri</h1>
          <p className="text-gray-600 mt-2">Tüm iş taleplerini görüntüle ve yönet</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/jobs">
            <Button variant={!statusFilter ? 'default' : 'outline'}>
              Tümü
            </Button>
          </Link>
          <Link href="/admin/jobs?status=pending">
            <Button variant={statusFilter === 'pending' ? 'default' : 'outline'}>
              Bekleyenler
            </Button>
          </Link>
          <Link href="/admin/jobs?status=accepted">
            <Button variant={statusFilter === 'accepted' ? 'default' : 'outline'}>
              Kabul Edilenler
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            İş Talepleri ({jobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>İlgili Usta</TableHead>
                  <TableHead>İş Açıklaması</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-right">Aksiyonlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      İş talebi bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.client_name}</TableCell>
                      <TableCell>{job.provider_name}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate" title={job.request_details}>
                          {job.request_details || '-'}
                        </p>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>{formatDate(job.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ChatViewButton
                            jobRequestId={job.id}
                            clientName={job.client_name}
                            providerName={job.provider_name}
                          />
                          <Link href={`/admin/jobs/${job.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Detay
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

