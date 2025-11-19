'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
}

interface HeaderMobileMenuProps {
  session: any
  profile: Profile | null
}

export function HeaderMobileMenu({ session, profile }: HeaderMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const userInitials = (profile?.first_name?.[0] || '') + (profile?.last_name?.[0] || '')

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menüyü aç</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menü</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/nasil-calisir"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
            >
              Nasıl Çalışır?
            </Link>
            <Link
              href="/kategoriler"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
            >
              Kategoriler
            </Link>
            {!session ? (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/kayit-ol" onClick={() => setIsOpen(false)}>
                    Kayıt Ol
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/giris-yap" onClick={() => setIsOpen(false)}>
                    Giriş Yap
                  </Link>
                </Button>
                <Button className="justify-start" asChild>
                  <Link href="/hizmet-ver" onClick={() => setIsOpen(false)}>
                    Hizmet Ver
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full justify-start">
                      <Avatar>
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback>{userInitials || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="ml-2">Hesabım</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profilim" onClick={() => setIsOpen(false)}>
                        Profilim
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/ayarlar" onClick={() => setIsOpen(false)}>
                        Ayarlar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}


