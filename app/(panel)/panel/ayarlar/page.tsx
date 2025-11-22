'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert'
import { AvatarUploader } from '@/components/panel/AvatarUploader'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function PanelAyarlarPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isProvider, setIsProvider] = useState(false)
  const [taxNumber, setTaxNumber] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  // Sayfa yüklendiğinde mevcut profil verilerini çek
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true)
        const supabase = createClient()

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          setMessage({ type: 'error', text: 'Kullanıcı bilgisi alınamadı. Lütfen giriş yapın.' })
          setFetching(false)
          return
        }

        setUserId(user.id)

        // Profil bilgilerini çek
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Profil yükleme hatası:', error)
          setMessage({ type: 'error', text: 'Profil bilgileri yüklenirken bir hata oluştu.' })
          setFetching(false)
          return
        }

        if (data) {
          setFirstName(data.first_name || '')
          setLastName(data.last_name || '')
          setPhone(data.phone || '')
          setBio(data.bio || '')
          setAvatarUrl(data.avatar_url || null)
          setIsProvider(data.is_provider || false)

          // Usta ise vergi no ve işletme adını çek
          if (data.is_provider) {
            setTaxNumber(data.tax_number || '')
            setBusinessName(data.business_name || '')
          }
        }
      } catch (err: any) {
        console.error('Beklenmeyen hata:', err)
        setMessage({ type: 'error', text: err.message || 'Profil yüklenirken bir hata oluştu.' })
      } finally {
        setFetching(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (!userId) {
        setMessage({ type: 'error', text: 'Kullanıcı bilgisi bulunamadı.' })
        setLoading(false)
        return
      }

      const supabase = createClient()

      // Güncelleme verisi
      const updateData: any = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      }

      // Usta ise vergi no ve işletme adını da ekle
      if (isProvider) {
        updateData.tax_number = taxNumber.trim()
        updateData.business_name = businessName.trim()
      }

      // Profil güncelle
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)

      if (updateError) {
        console.error('Güncelleme hatası:', updateError)
        setMessage({
          type: 'error',
          text: `Profil güncellenirken hata: ${updateError.message}`,
        })
        setLoading(false)
        return
      }

      // Başarılı
      setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi!' })

      // 3 saniye sonra mesajı kaldır
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (err: any) {
      console.error('Beklenmeyen hata:', err)
      setMessage({ type: 'error', text: err.message || 'Profil güncellenirken bir hata oluştu.' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Profil Ayarları</h1>
        <p className="text-gray-600 mt-2">
          Profil bilgilerinizi güncelleyin ve hesabınızı yönetin
        </p>
      </div>

      {message && (
        <Alert
          className={
            message.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription
            className={
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profil Fotoğrafı */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Fotoğrafı</CardTitle>
            <CardDescription>
              Profil fotoğrafınızı yükleyin veya güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userId && (
              <AvatarUploader
                currentAvatarUrl={avatarUrl}
                userId={userId}
                firstName={firstName}
                lastName={lastName}
                onUploadSuccess={(url) => {
                  setAvatarUrl(url)
                  setMessage({ type: 'success', text: 'Profil fotoğrafı başarıyla güncellendi!' })
                  setTimeout(() => setMessage(null), 3000)
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Kişisel Bilgiler */}
        <Card>
          <CardHeader>
            <CardTitle>Kişisel Bilgiler</CardTitle>
            <CardDescription>
              Ad, soyad ve iletişim bilgilerinizi güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Adınız"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Soyadınız"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0555 123 45 67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biyografi</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Müşterilere kendinizi tanıtın. Bu bilgi profilinizde görünecektir.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Usta Bilgileri (Sadece Usta ise) */}
        {isProvider && (
          <Card>
            <CardHeader>
              <CardTitle>İşletme Bilgileri</CardTitle>
              <CardDescription>
                İşletme adı ve vergi numaranızı güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">İşletme Adı</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="İşletme veya firma adınız"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxNumber">Vergi Numarası</Label>
                <Input
                  id="taxNumber"
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  placeholder="Vergi numaranız"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kaydet Butonu */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              'Değişiklikleri Kaydet'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

