'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { AlertCircle, Info } from 'lucide-react'
import PageContainer from '@/components/PageContainer'

export default function GirisYapPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL'den mesaj parametresini kontrol et
  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'inactivity_logout') {
      setInfoMessage('Uzun süre hareketsiz kaldığınız için güvenli çıkış yapıldı.')
    }
  }, [searchParams])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    // Hata mesajını temizle
    setErrorMessage('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Giriş hatası:', error)
        setErrorMessage(error.message)
        return
      }

      // Başarılı giriş
      setErrorMessage('')
      router.refresh() // SUNUCU BİLEŞENLERİNİ YENİLE (HEADER'I GÜNCELLE)
      router.push('/') // ŞİMDİ ANASAYFAYA YÖNLENDİR
    } catch (err) {
      console.error('Beklenmeyen hata:', err)
      setErrorMessage('Giriş başarısız: Bir hata oluştu. Lütfen tekrar deneyin.')
      return
    }
  }

  return (
    <PageContainer>
      <Card className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-xl shadow-lg w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Giriş Yap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-6">
            {infoMessage && (
              <Alert className="text-blue-600 border-blue-200 bg-blue-50">
                <Info className="h-4 w-4" />
                <AlertTitle>Bilgi</AlertTitle>
                <AlertDescription>{infoMessage}</AlertDescription>
              </Alert>
            )}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

