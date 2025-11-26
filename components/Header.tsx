'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Menu, User, LogOut, LayoutDashboard, UserCircle } from 'lucide-react'
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
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* YENİ LOGO (SVG) */}
            <div className="relative w-12 h-12 md:w-14 md:h-14">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                    <defs>
                        <linearGradient id="pinGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FB923C" /> <stop offset="1" stopColor="#EA580C" /> </linearGradient>
                    </defs>
                  
                    <path 
                        d="M50 5C27.9 5 10 22.9 10 45C10 69 50 95 50 95C50 95 90 69 90 45C90 22.9 72.1 5 50 5Z" 
                        fill="url(#pinGradient)" 
                    />
                  
                    <path 
                        d="M30 42L50 26L70 42V55H30V42Z" 
                        fill="white" 
                    />
                  
                    <path 
                        d="M50 58C46.1 58 43 61.1 43 65C43 68.9 46.1 72 50 72C53.9 72 57 68.9 57 65C57 61.1 53.9 58 50 58ZM50 69C47.8 69 46 67.2 46 65C46 62.8 47.8 61 50 61C52.2 61 54 62.8 54 65C54 67.2 52.2 69 50 69Z" 
                        fill="white" 
                    />
                    <path 
                        d="M60 65H63M37 65H40M50 52V55M50 75V78" 
                        stroke="white" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                    />
                </svg>
            </div>

            <div className="flex flex-col justify-center -space-y-1">
                <span className="text-xl md:text-3xl font-bold text-slate-800 tracking-tight leading-none">
                    ANTALYA
                </span>
                <span className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                    USTASI
                </span>
            </div>
            <span className="w-2 h-2 md:w-3 md:h-3 bg-orange-500 rounded-full mb-1 self-end mb-2"></span>
          </Link>

          {/* ESKİ LOGO (YORUM SATIRI)
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* 1. SOYUT LOGO İKONU (SVG) * /}
            <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-indigo-600 rounded-xl shadow-sm transform group-hover:rotate-3 transition-transform duration-300">
              {/* Beyaz soyut yapı sembolü * /}
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5 md:w-6 md:h-6 text-white"
              >
                <path 
                  d="M3 21L12 4L21 21H3Z" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 4V21" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="opacity-50"
                />
              </svg>
            </div>

            {/* 2. MODERN TİPOGRAFİ * /}
            <div className="flex flex-col justify-center -space-y-1">
              <span className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tighter leading-none">
                ANTALYA
                <span className="text-indigo-600">USTASI</span>
              </span>
              <span className="hidden md:block text-[10px] font-medium text-slate-400 tracking-widest uppercase ml-0.5">
                Profesyonel Hizmetler
              </span>
            </div>
          </Link>
          */}

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
