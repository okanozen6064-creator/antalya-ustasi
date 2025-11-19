'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import PageContainer from '@/components/PageContainer'

export default function KayitOlPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mesajları temizle
    setErrorMessage('')
    setSuccessMessage('')

    // Şifre kontrolü
    if (password !== confirmPassword) {
      setErrorMessage('Şifreler eşleşmiyor!')
      return
    }

    // Şifre uzunluk kontrolü
    if (password.length < 6) {
      setErrorMessage('Şifre en az 6 karakter olmalıdır!')
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('Kayıt hatası:', error)
        setErrorMessage(error.message)
        setSuccessMessage('')
        return
      }

      // Hata yoksa başarılı mesajını göster
      setSuccessMessage('Kayıt başarılı! Lütfen onay için e-postanızı kontrol edin.')
      setErrorMessage('')
      router.refresh() // SUNUCU BİLEŞENLERİNİ YENİLE (HEADER'I GÜNCELLE)
      // router.push('/')
    } catch (err) {
      console.error('Beklenmeyen hata:', err)
      setErrorMessage('Kayıt başarısız: Bir hata oluştu. Lütfen tekrar deneyin.')
      setSuccessMessage('')
      return
    }
  }

  return (
    <PageContainer>
      <Card className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-xl shadow-lg w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Kayıt Ol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-6">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Başarılı</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full">
              Kayıt Ol
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

