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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { UserActions } from '@/components/admin/UserActions'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  is_provider: boolean
  is_verified: boolean
  is_admin: boolean
  created_at: string
  bio: string | null
  tax_number: string | null
  business_name: string | null
  avatar_url: string | null
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams
  const filter = resolvedSearchParams?.filter

  // Kullanıcıları çek (tüm alanlarla)
  let query = supabase
    .from('profiles')
    .select(
      'id, first_name, last_name, email, phone, is_provider, is_verified, is_admin, created_at, bio, tax_number, business_name, avatar_url'
    )
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

  // Onay bekleyenleri öne çıkar (is_verified ASC, created_at DESC)
  const sortedProfiles = [...(profiles || [])].sort((a, b) => {
    // Önce onay durumuna göre (false önce)
    if (a.is_provider && !a.is_verified && !(b.is_provider && !b.is_verified)) return -1
    if (b.is_provider && !b.is_verified && !(a.is_provider && !a.is_verified)) return 1
    // Sonra tarihe göre (yeni önce)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const getFullName = (profile: UserProfile) => {
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'İsimsiz'
  }

  const getInitials = (profile: UserProfile) => {
    const first = profile.first_name?.charAt(0) || ''
    const last = profile.last_name?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-2">Tüm kullanıcıları görüntüle ve yönet</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/users">
            <Button variant={filter !== 'pending' ? 'default' : 'outline'}>Tümü</Button>
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
                  <TableHead>Avatar & İsim</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Telefon</TableHead>
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
                          ? 'bg-orange-50 hover:bg-orange-100'
                          : ''
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile.avatar_url || undefined} alt={getFullName(profile)} />
                            <AvatarFallback className="bg-indigo-600 text-white">
                              {getInitials(profile)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{getFullName(profile)}</span>
                            <span className="text-sm text-gray-500">{profile.email || '-'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={profile.is_provider ? 'default' : 'secondary'}
                          className={profile.is_provider ? 'bg-blue-500' : ''}
                        >
                          {profile.is_provider ? 'PRO' : 'USER'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">{profile.phone || '-'}</span>
                      </TableCell>
                      <TableCell>
                        {profile.is_provider ? (
                          profile.is_verified ? (
                            <Badge className="bg-green-500">ONAYLI</Badge>
                          ) : (
                            <Badge className="bg-orange-500">BEKLİYOR</Badge>
                          )
                        ) : (
                          <Badge variant="outline">AKTİF</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {format(new Date(profile.created_at), 'dd/MM/yyyy', { locale: tr })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActions
                          userId={profile.id}
                          isProvider={profile.is_provider}
                          isVerified={profile.is_verified}
                          profile={{
                            first_name: profile.first_name,
                            last_name: profile.last_name,
                            email: profile.email,
                            phone: profile.phone,
                            bio: profile.bio,
                            tax_number: profile.tax_number,
                            business_name: profile.business_name,
                          }}
                        />
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
