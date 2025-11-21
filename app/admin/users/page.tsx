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
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { VerifyButton } from '@/components/admin/VerifyButton'

export const dynamic = 'force-dynamic'

interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  is_provider: boolean
  is_verified: boolean
  created_at: string
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  const filter = resolvedSearchParams?.filter

  // Kullanıcıları çek
  let query = supabase
    .from('profiles')
    .select('id, first_name, last_name, email, is_provider, is_verified, created_at')
    .order('created_at', { ascending: false })

  // Filtreleme
  if (filter === 'pending') {
    query = query.eq('is_provider', true).eq('is_verified', false)
  }

  const { data: profiles, error } = await query

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Kullanıcılar yüklenirken bir hata oluştu: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getFullName = (profile: UserProfile) => {
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'İsimsiz'
  }

  const getRole = (profile: UserProfile) => {
    if (profile.is_provider) return 'Usta'
    return 'Müşteri'
  }

  const getStatus = (profile: UserProfile) => {
    if (profile.is_provider) {
      return profile.is_verified ? 'Onaylı' : 'Bekliyor'
    }
    return 'Aktif'
  }

  const getStatusBadge = (profile: UserProfile) => {
    if (profile.is_provider) {
      if (profile.is_verified) {
        return <Badge className="bg-green-500">Onaylı</Badge>
      }
      return <Badge className="bg-orange-500">Onay Bekliyor</Badge>
    }
    return <Badge variant="outline">Aktif</Badge>
  }

  // Onay bekleyenleri öne çıkar
  const sortedProfiles = [...(profiles || [])].sort((a, b) => {
    if (a.is_provider && !a.is_verified && !(b.is_provider && !b.is_verified)) return -1
    if (b.is_provider && !b.is_verified && !(a.is_provider && !a.is_verified)) return 1
    return 0
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-2">Tüm kullanıcıları görüntüle ve yönet</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/users">
            <Button variant={filter !== 'pending' ? 'default' : 'outline'}>
              Tümü
            </Button>
          </Link>
          <Link href="/admin/users?filter=pending">
            <Button variant={filter === 'pending' ? 'default' : 'outline'}>
              Onay Bekleyenler
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'pending' ? 'Onay Bekleyen Ustalar' : 'Tüm Kullanıcılar'} (
            {sortedProfiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Kayıt Tarihi</TableHead>
                  <TableHead className="text-right">Aksiyonlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Kullanıcı bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProfiles.map((profile) => (
                    <TableRow
                      key={profile.id}
                      className={
                        profile.is_provider && !profile.is_verified
                          ? 'bg-orange-50'
                          : ''
                      }
                    >
                      <TableCell className="font-medium">
                        {getFullName(profile)}
                      </TableCell>
                      <TableCell>{profile.email || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={profile.is_provider ? 'default' : 'secondary'}>
                          {getRole(profile)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(profile)}</TableCell>
                      <TableCell>{formatDate(profile.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/profil/${profile.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Detay
                            </Button>
                          </Link>
                          {profile.is_provider && (
                            <VerifyButton
                              userId={profile.id}
                              isVerified={profile.is_verified}
                            />
                          )}
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

