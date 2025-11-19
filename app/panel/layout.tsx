import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Session yoksa ana sayfaya yönlendir
  if (!session) {
    redirect('/')
  }

  // Profil kontrolü - is_provider kontrolü
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_provider')
    .eq('id', session.user.id)
    .single()

  // Profil hatası varsa veya kullanıcı esnaf değilse ana sayfaya yönlendir
  if (profileError || !profile?.is_provider) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex-shrink-0">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Esnaf Paneli</h2>
        </div>
        <nav className="space-y-2">
          <Link
            href="/panel"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            Ana Panel
          </Link>
          <Link
            href="/panel/profil"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            Profilimi Düzenle
          </Link>
          <Link
            href="/panel/mesajlar"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            Gelen İşler
          </Link>
          <Link
            href="/"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors mt-8 text-gray-400"
          >
            Siteye Dön
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}

