'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Checkbox } from '@/components/ui/checkbox'
import PageContainer from '@/components/PageContainer'

interface Service {
  id: string
  name: string
}

interface District {
  id: number
  name: string
}

export default function ProfilOlusturPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [isProvider, setIsProvider] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [services, setServices] = useState<Service[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Kategorileri ve ilçeleri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        // Hizmetleri çek
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name')
          .order('name', { ascending: true })

        if (servicesError) {
          console.error('Kategoriler yüklenirken hata:', servicesError)
          setError('Kategoriler yüklenirken bir hata oluştu.')
        } else {
          setServices(servicesData || [])
        }

        // İlçeleri çek
        const { data: districtsData, error: districtsError } = await supabase
          .from('antalya_districts')
          .select('id, name')
          .order('name', { ascending: true })

        if (districtsError) {
          console.error('İlçeler yüklenirken hata:', districtsError)
        } else {
          setDistricts(districtsData || [])
        }
      } catch (err) {
        console.error('Beklenmeyen hata:', err)
        setError('Veriler yüklenirken bir hata oluştu.')
      }
    }

    fetchData()
  }, [])

  // Kaydet fonksiyonu
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setIsLoading(true)

      const supabase = createClient()

      // Mevcut kullanıcıyı al
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError('Kullanıcı bilgisi alınamadı. Lütfen giriş yapın.')
        return
      }

      // Hizmet veren ise ve kategori seçilmemişse hata ver
      if (isProvider && !selectedService) {
        setError('Hizmet veren olarak işaretlediyseniz, lütfen bir hizmet kategorisi seçiniz.')
        return
      }

      // Profil bilgilerini güncelle (location OLMADAN)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          bio: bio || null,
          is_provider: isProvider,
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Profil güncelleme hatası:', updateError)
        setError(`Profil güncellenemedi: ${updateError.message}`)
        return
      }

      // YENİ MİMARİ: provider_services köprü tablosuna kayıt ekle
      if (isProvider && selectedService) {
        const { error: bridgeError } = await supabase
          .from('provider_services')
          .insert({
            provider_id: user.id,
            service_id: selectedService,
          })

        if (bridgeError) {
          console.error('Hizmet ekleme hatası:', bridgeError)
          setError(`Hizmet kategorisi eklenemedi: ${bridgeError.message}`)
          return
        }
      }

      // YENİ MİMARİ: provider_locations köprü tablosuna kayıt ekle
      if (selectedDistricts.length > 0) {
        const insertData = selectedDistricts.map((districtId) => ({
          provider_id: user.id,
          district_id: districtId,
        }))

        const { error: locationsError } = await supabase
          .from('provider_locations')
          .insert(insertData)

        if (locationsError) {
          console.error('İlçe ekleme hatası:', locationsError)
          setError(`İlçeler eklenemedi: ${locationsError.message}`)
          return
        }
      }

      // Başarılı - ana sayfaya yönlendir
      router.push('/')
    } catch (err: any) {
      console.error('Beklenmeyen hata:', err)
      setError(err?.message || 'Profil oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer>
      <Card className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Profil Oluştur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad *</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Adınız"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad *</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Soyadınız"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0555 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Hizmet Bölgeleri (İlçeler)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 p-4 border rounded-lg">
                {districts.map((district) => (
                  <div key={district.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`district-${district.id}`}
                      checked={selectedDistricts.includes(district.id)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          setSelectedDistricts([...selectedDistricts, district.id])
                        } else {
                          setSelectedDistricts(selectedDistricts.filter((id) => id !== district.id))
                        }
                      }}
                    />
                    <Label
                      htmlFor={`district-${district.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {district.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Kısa Bio</Label>
              <Input
                id="bio"
                type="text"
                placeholder="Kendiniz hakkında kısa bir açıklama"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isProvider"
                checked={isProvider}
                onCheckedChange={setIsProvider}
              />
              <Label htmlFor="isProvider" className="cursor-pointer">
                Hizmet Veren (Esnaf/Usta)
              </Label>
            </div>

            {isProvider && (
              <div className="space-y-2">
                <Label htmlFor="selectedService">Hizmet Kategorisi *</Label>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Bir kategori seçiniz..." />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
