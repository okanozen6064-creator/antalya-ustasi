import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Home, MessageSquare, Settings, ArrowLeft, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Session yoksa login sayfasına yönlendir
  if (!session) {
    redirect('/giris-yap')
  }

  // Profil bilgilerini çek
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, is_provider')
    .eq('id', session.user.id)
    .single()

  const menuItems = [
    { href: '/panel', label: 'Genel Bakış', icon: Home },
    { href: '/panel/mesajlar', label: 'Mesajlar & Teklifler', icon: MessageSquare },
    { href: '/panel/ayarlar', label: 'Profil Ayarları', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-800 text-white min-h-screen p-4 flex-shrink-0 hidden md:block">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-400">Kullanıcı Paneli</h2>
          {profile && (
            <p className="text-sm text-slate-400 mt-1">
              {profile.first_name} {profile.last_name}
            </p>
          )}
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 py-2 px-4 rounded-md text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/"
            className="flex items-center gap-2 py-2 px-4 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors mt-8"
          >
            <ArrowLeft className="h-5 w-5" />
            Siteye Dön
          </Link>
        </nav>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden w-full bg-slate-800 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h2 className="text-xl font-bold text-indigo-400">Kullanıcı Paneli</h2>
          {profile && (
            <p className="text-xs text-slate-400">
              {profile.first_name} {profile.last_name}
            </p>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-slate-800 text-white border-r-0 w-64">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-400">Kullanıcı Paneli</h2>
              {profile && (
                <p className="text-sm text-slate-400 mt-1">
                  {profile.first_name} {profile.last_name}
                </p>
              )}
            </div>
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 py-2 px-4 rounded-md text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/"
                className="flex items-center gap-2 py-2 px-4 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors mt-8"
              >
                <ArrowLeft className="h-5 w-5" />
                Siteye Dön
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}



