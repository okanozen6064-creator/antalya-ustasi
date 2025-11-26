'use client'

import { useFormState } from 'react-dom'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerClient } from '@/app/actions/auth'
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
import { LegalAgreement } from '@/components/auth/LegalAgreement'
import { useState } from 'react'

const initialState = {
  success: false,
  error: undefined,
  message: undefined,
}

export default function ClientRegisterPage() {
  const [state, formAction] = useFormState(registerClient, initialState)
  const [legalAccepted, setLegalAccepted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      // Başarılı kayıt sonrası yönlendirme
      // Email'i state'den alamıyoruz ama formAction sonrası state güncelleniyor.
      // Basitlik için direkt success sayfasına yönlendirelim.
      router.push('/register/success')
    }
  }, [state.success, router])

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
            <form action={formAction} className="space-y-4">
              {state.error && typeof state.error === 'string' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Hata</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="full_name">Ad Soyad *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Adınız ve Soyadınız"
                  required
                  className="w-full"
                />
                {state.error && typeof state.error === 'object' && state.error.full_name && (
                  <p className="text-sm text-red-500">{state.error.full_name[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ornek@email.com"
                  required
                  className="w-full"
                />
                {state.error && typeof state.error === 'object' && state.error.email && (
                  <p className="text-sm text-red-500">{state.error.email[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  className="w-full"
                />
                {state.error && typeof state.error === 'object' && state.error.phone && (
                  <p className="text-sm text-red-500">{state.error.phone[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="En az 6 karakter"
                  required
                  minLength={6}
                  className="w-full"
                />
                {state.error && typeof state.error === 'object' && state.error.password && (
                  <p className="text-sm text-red-500">{state.error.password[0]}</p>
                )}
              </div>

              <LegalAgreement onAccept={setLegalAccepted} />

              {/* Hidden input for legalAccepted since it's not a standard form element */}
              <input type="hidden" name="legalAccepted" value={legalAccepted.toString()} />

              {state.error && typeof state.error === 'object' && state.error.legalAccepted && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.error.legalAccepted[0]}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                Kayıt Ol
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
