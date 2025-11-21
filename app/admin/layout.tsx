import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, Users, Briefcase, Home, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
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

  // Admin kontrolü - is_admin kontrolü
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  // Profil hatası varsa veya kullanıcı admin değilse ana sayfaya yönlendir
  if (profileError || !profile?.is_admin) {
    redirect('/')
  }

  const menuItems = [
    { href: '/admin', label: 'Genel Bakış', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Kullanıcılar', icon: Users },
    { href: '/admin/jobs', label: 'İş Talepleri', icon: Briefcase },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white min-h-screen p-6 flex-shrink-0 flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Yönetim Paneli</h2>
          <p className="text-sm text-slate-400 mt-1">Admin Dashboard</p>
        </div>
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors text-slate-200 hover:text-white"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div className="pt-8 mt-8 border-t border-slate-700">
            <Link
              href="/"
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              <Home className="h-5 w-5" />
              <span>Siteye Dön</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-slate-900 text-white p-0">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Yönetim Paneli</h2>
              <p className="text-sm text-slate-400 mt-1">Admin Dashboard</p>
            </div>
            <nav className="space-y-2 p-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors text-slate-200 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="pt-8 mt-8 border-t border-slate-700">
                <Link
                  href="/"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                >
                  <Home className="h-5 w-5" />
                  <span>Siteye Dön</span>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-0 min-h-screen">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

