'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MailCheck } from 'lucide-react'
import PageContainer from '@/components/PageContainer'

export default function RegisterSuccessPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'e-posta adresinize'

  return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Büyük Yeşil Mail İkonu */}
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <MailCheck className="h-12 w-12 text-green-600" />
              </div>

              {/* Başlık */}
              <h1 className="text-2xl font-bold text-gray-900">
                Kayıt Başarılı!
              </h1>

              {/* Mesaj */}
              <p className="text-gray-600 leading-relaxed">
                Harika! Kaydınızı tamamlamak için lütfen{' '}
                <span className="font-semibold text-indigo-600">{email}</span>{' '}
                adresine gönderdiğimiz onay linkine tıklayın.
              </p>

              {/* Ana Sayfaya Dön Butonu */}
              <Link href="/">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Ana Sayfaya Dön
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}



