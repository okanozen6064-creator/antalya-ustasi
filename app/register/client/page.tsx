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
import { AlertCircle } from 'lucide-react'
import PageContainer from '@/components/PageContainer'

export default function ClientRegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    // Validasyon
    if (!fullName.trim()) {
      setErrorMessage('Ad Soyad gereklidir!')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setErrorMessage('Şifre en az 6 karakter olmalıdır!')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Ad Soyad'ı first_name ve last_name'e ayır
      const nameParts = fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            is_provider: false,
          },
        },
      })

      if (error) {
        console.error('Kayıt hatası:', error)
        
        // Hata mesajlarını Türkçe ve açıklayıcı hale getir
        let userFriendlyMessage = error.message
        
        // Supabase hata kodlarına göre özel mesajlar
        if (error.message.includes('already registered') || error.message.includes('already exists') || error.message.includes('User already registered')) {
          userFriendlyMessage = 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yap sayfasından giriş yapın veya farklı bir e-posta adresi kullanın.'
        } else if (error.message.includes('Invalid email')) {
          userFriendlyMessage = 'Geçersiz e-posta adresi. Lütfen doğru bir e-posta adresi girin.'
        } else if (error.message.includes('Password')) {
          userFriendlyMessage = 'Şifre çok kısa. Şifreniz en az 6 karakter olmalıdır.'
        } else if (error.message.includes('email')) {
          userFriendlyMessage = 'E-posta adresi ile ilgili bir hata oluştu. Lütfen tekrar deneyin.'
        }
        
        setErrorMessage(userFriendlyMessage)
        setLoading(false)
        return
      }

      // Başarılı kayıt - profiles tablosunu güncelle
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
          })
          .eq('id', data.user.id)

        if (profileError) {
          console.error('Profil güncelleme hatası:', profileError)
          // Hata olsa bile devam et, kullanıcıyı yönlendir
        }
      }

      // Başarılı - success sayfasına yönlendir
      router.push(`/register/success?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      console.error('Beklenmeyen hata:', err)
      
      // Beklenmeyen hatalar için de açıklayıcı mesaj
      let userFriendlyMessage = 'Kayıt başarısız: Bir hata oluştu. Lütfen tekrar deneyin.'
      
      if (err.message) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          userFriendlyMessage = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.'
        } else if (err.message.includes('timeout')) {
          userFriendlyMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
        } else {
          userFriendlyMessage = err.message
        }
      }
      
      setErrorMessage(userFriendlyMessage)
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Müşteri Kayıt Formu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Hata</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Ad Soyad *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Adınız ve Soyadınız"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta *</Label>
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
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

