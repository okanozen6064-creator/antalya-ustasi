'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Menu, Hammer, User, LogOut, LayoutDashboard, UserCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isProvider, setIsProvider] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        // Kullanıcı varsa profil bilgisini kontrol et
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_provider')
            .eq('id', user.id)
            .single()

          setIsProvider(profile?.is_provider || false)
        }
      } catch (error) {
        console.error('Header Auth Hatası (Önemsiz):', error)
      } finally {
        setLoading(false)
      }
    }
    checkUser()

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Kullanıcının baş harflerini al
  const getUserInitials = (email: string) => {
    if (!email) return 'U'
    const parts = email.split('@')[0]
    if (parts.length >= 2) {
      return parts.substring(0, 2).toUpperCase()
    }
    return parts.charAt(0).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        
        {/* Sol Taraf: Logo ve Menü Linkleri */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Hammer className="h-6 w-6 text-indigo-600" />
            <span className="text-xl md:text-2xl font-black tracking-tight text-indigo-600">
              ANTALYA USTASI
            </span>
          </Link>

          {/* Masaüstü Menü Linkleri */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/hizmetler" className="hover:text-indigo-600 transition-colors">
              Kategoriler
            </Link>
            <Link href="/nasil-calisir" className="hover:text-indigo-600 transition-colors">
              Nasıl Çalışır
            </Link>
          </nav>
        </div>

        {/* Sağ Taraf: Auth Butonları veya Kullanıcı Menüsü */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            // Giriş Yapmış Kullanıcı
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                      {getUserInitials(user.email || '')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Hesabım</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profil/[slug]" as={`/profil/${user.id}`} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profilim
                  </Link>
                </DropdownMenuItem>
                {isProvider && (
                  <DropdownMenuItem asChild>
                    <Link href="/panel" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Panelim
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Giriş Yapmamış Kullanıcı
            <>
              {/* Masaüstü Butonlar */}
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/register/client">Kayıt Ol</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/giris-yap">Giriş Yap</Link>
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                  <Link href="/register/pro">Antalya Ustası Ol</Link>
                </Button>
              </div>

              {/* Mobil Menü (Burger Menu) */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="flex flex-col gap-4 mt-8">
                      <Link href="/hizmetler" className="text-lg font-medium">
                        Kategoriler
                      </Link>
                      <Link href="/nasil-calisir" className="text-lg font-medium">
                        Nasıl Çalışır
                      </Link>
                      <div className="h-px bg-gray-200 my-2" />
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/register/client">Kayıt Ol</Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/giris-yap">Giriş Yap</Link>
                      </Button>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full" asChild>
                        <Link href="/register/pro">Antalya Ustası Ol</Link>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
