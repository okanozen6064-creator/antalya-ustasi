import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, Briefcase, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // İstatistikleri çek
  const [
    totalUsersResult,
    pendingProvidersResult,
    totalJobsResult,
    activeListingsResult,
  ] = await Promise.all([
    // Toplam Kullanıcı
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    
    // Bekleyen Usta Onayları (is_provider = true ve is_verified = false)
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_provider', true)
      .eq('is_verified', false),
    
    // Toplam İş Talebi
    supabase.from('job_requests').select('*', { count: 'exact', head: true }),
    
    // Yayındaki İlanlar (is_provider = true ve is_verified = true)
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_provider', true)
      .eq('is_verified', true),
  ])

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: totalUsersResult.count || 0,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Bekleyen Usta Onayları',
      value: pendingProvidersResult.count || 0,
      icon: UserCheck,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Toplam İş Talebi',
      value: totalJobsResult.count || 0,
      icon: Briefcase,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Yayındaki İlanlar',
      value: activeListingsResult.count || 0,
      icon: FileText,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Genel Bakış</h1>
        <p className="text-gray-600 mt-2">Sistem istatistikleri ve özet bilgiler</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">Toplam kayıt</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Hızlı Aksiyonlar */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı Aksiyonlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users?filter=pending"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Onay Bekleyen Ustalar</h3>
              <p className="text-sm text-gray-600 mt-1">
                {pendingProvidersResult.count || 0} usta onay bekliyor
              </p>
            </a>
            <a
              href="/admin/jobs?status=pending"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Bekleyen İş Talepleri</h3>
              <p className="text-sm text-gray-600 mt-1">Yeni iş taleplerini görüntüle</p>
            </a>
            <a
              href="/admin/users"
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Tüm Kullanıcılar</h3>
              <p className="text-sm text-gray-600 mt-1">Kullanıcı yönetimi</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

