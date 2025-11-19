import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HeaderMobileMenu } from './HeaderMobileMenu'

// Çıkış Yap (Sign Out) Server Action
async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function Header() {
  // Supabase client'ı oluştur (cookie'leri okuyacak)
  const supabase = await createClient()

  // Kullanıcı session'ını kontrol et
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Eğer session varsa, profil bilgilerini çek
  let profile = null
  if (session?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .eq('id', session.user.id)
      .single()
    profile = data
  }

  const userInitials = (profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '')

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Sol Taraf */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              {/* İkon: A Harfi */}
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                <span className="text-white font-bold text-xl">A</span>
              </div>

              {/* İsim ve Slogan */}
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none">
                  ANTALYA USTASI
                </span>
                <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mt-0.5">
                  ŞEHRİN EN İYİLERİ
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Sağ Taraf */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/nasil-calisir"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Nasıl Çalışır?
            </Link>
            <Link
              href="/kategoriler"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Kategoriler
            </Link>

            {/* Session Kontrolü */}
            {session ? (
              // Giriş Yapmışsa: Avatar Menüsü
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback>{userInitials || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/panel/profil">Profilim</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <form action={signOut}>
                    <DropdownMenuItem asChild>
                      <button type="submit" className="w-full text-left cursor-pointer">
                        Çıkış Yap
                      </button>
                    </DropdownMenuItem>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Ziyaretçiyse: Giriş/Kayıt Butonları
              <>
                <Button variant="ghost" asChild>
                  <Link href="/kayit-ol">Kayıt Ol</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/giris-yap">Giriş Yap</Link>
                </Button>
                <Button asChild>
                  <Link href="/hizmet-ver">Hizmet Ver</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <HeaderMobileMenu session={session} profile={profile} />
          </div>
        </div>
      </div>
    </header>
  )
}
