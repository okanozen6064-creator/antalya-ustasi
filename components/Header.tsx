'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Menu, User, LogOut, LayoutDashboard, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Header Auth Hatası (Önemsiz):', error)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        
        {/* 1. Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-black tracking-tight text-indigo-600">
            ANTALYA USTASI
          </span>
        </Link>

        {/* 2. Masaüstü Navigasyon */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
          <Link href="/hizmetler" className="hover:text-indigo-600 transition-colors">Hizmetler</Link>
          <Link href="/nasil-calisir" className="hover:text-indigo-600 transition-colors">Nasıl Çalışır?</Link>
        </nav>

        {/* 3. Sağ Taraf (Auth) */}
        <div className="flex items-center gap-4">
          {loading ? (
             <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border bg-gray-100">
                  <User className="h-5 w-5 text-gray-600" />
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
                    <Link href="/panel/profil" className="cursor-pointer"><LayoutDashboard className="mr-2 h-4 w-4"/> Esnaf Paneli</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/panel/ayarlar" className="cursor-pointer"><Settings className="mr-2 h-4 w-4"/> Ayarlar</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/giris-yap">Giriş Yap</Link>
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                <Link href="/profil-olustur">Usta Kaydı</Link>
              </Button>
            </div>
          )}

          {/* 4. Mobil Menü (Hamburger) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-medium">Ana Sayfa</Link>
                  <Link href="/hizmetler" className="text-lg font-medium">Hizmetler</Link>
                  <Link href="/nasil-calisir" className="text-lg font-medium">Nasıl Çalışır?</Link>
                  <div className="h-px bg-gray-200 my-2" />
                  {!user && (
                    <>
                      <Link href="/giris-yap" className="text-lg font-medium text-indigo-600">Giriş Yap</Link>
                      <Link href="/profil-olustur" className="text-lg font-medium text-indigo-600">Kayıt Ol</Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
