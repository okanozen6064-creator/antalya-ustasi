'use client'

import { useState, useEffect } from 'react'
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

export default function ProRegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Verileri çek (Server-side benzeri, client-side)
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
          console.error('Hizmetler yüklenirken hata:', servicesError)
          setErrorMessage('Hizmetler yüklenirken bir hata oluştu.')
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
          setErrorMessage('İlçeler yüklenirken bir hata oluştu.')
        } else {
          setDistricts(districtsData || [])
        }
      } catch (err) {
        console.error('Beklenmeyen hata:', err)
        setErrorMessage('Veriler yüklenirken bir hata oluştu.')
      }
    }

    fetchData()
  }, [])

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const toggleDistrict = (districtId: number) => {
    setSelectedDistricts((prev) =>
      prev.includes(districtId)
        ? prev.filter((id) => id !== districtId)
        : [...prev, districtId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    // Validasyon
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Ad ve Soyad gereklidir!')
      setLoading(false)
      return
    }

    if (!taxNumber.trim()) {
      setErrorMessage('Vergi Numarası gereklidir!')
      setLoading(false)
      return
    }

    if (selectedServices.length === 0) {
      setErrorMessage('En az bir hizmet seçmelisiniz!')
      setLoading(false)
      return
    }

    if (selectedDistricts.length === 0) {
      setErrorMessage('En az bir ilçe seçmelisiniz!')
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

      // ADIM 1: Kullanıcıyı oluştur (is_provider: true metadata ile)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            is_provider: true,
          },
        },
      })

      if (authError || !authData.user) {
        console.error('Kullanıcı oluşturma hatası:', authError)
        setErrorMessage(authError?.message || 'Kullanıcı oluşturulamadı!')
        setLoading(false)
        return
      }

      const userId = authData.user.id

      // ADIM 2: Profiles tablosunu güncelle
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          business_name: businessName || null,
          tax_number: taxNumber,
          is_provider: true,
        })
        .eq('id', userId)

      if (profileError) {
        console.error('Profil güncelleme hatası:', profileError)
        setErrorMessage(`Profil güncellenirken hata: ${profileError.message}`)
        setLoading(false)
        return
      }

      // ADIM 3: Seçilen hizmetleri provider_services tablosuna ekle
      const serviceInserts = selectedServices.map((serviceId) => ({
        provider_id: userId,
        service_id: serviceId,
      }))

      const { error: servicesError } = await supabase
        .from('provider_services')
        .insert(serviceInserts)

      if (servicesError) {
        console.error('Hizmet ekleme hatası:', servicesError)
        setErrorMessage(`Hizmetler eklenirken hata: ${servicesError.message}`)
        setLoading(false)
        return
      }

      // ADIM 4: Seçilen ilçeleri provider_locations tablosuna ekle
      const locationInserts = selectedDistricts.map((districtId) => ({
        provider_id: userId,
        district_id: districtId,
      }))

      const { error: locationsError } = await supabase
        .from('provider_locations')
        .insert(locationInserts)

      if (locationsError) {
        console.error('İlçe ekleme hatası:', locationsError)
        setErrorMessage(`İlçeler eklenirken hata: ${locationsError.message}`)
        setLoading(false)
        return
      }

      // Başarılı - success sayfasına yönlendir
      router.push(`/register/success?email=${encodeURIComponent(email)}`)
    } catch (err: any) {
      console.error('Beklenmeyen hata:', err)
      setErrorMessage(err.message || 'Kayıt başarısız: Bir hata oluştu. Lütfen tekrar deneyin.')
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="py-12 max-w-4xl mx-auto">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-indigo-600">
              Antalya'nın En İyi Ustaları Arasına Katılın
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Profesyonel kayıt formunu doldurun ve müşterilere ulaşın
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Hata</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Kişisel Bilgiler */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Kişisel Bilgiler
                </h3>
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
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
                    />
                  </div>
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
                  />
                </div>
              </div>

              {/* İşletme Bilgileri */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  İşletme Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">İşletme Adı</Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="İşletme adınız (opsiyonel)"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxNumber">Vergi Numarası *</Label>
                    <Input
                      id="taxNumber"
                      type="text"
                      placeholder="Vergi numaranız"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Uzmanlık Alanları */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Uzmanlık Alanları (Çoklu Seçim) *
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 border rounded-lg bg-gray-50">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-white cursor-pointer"
                      onClick={() => toggleService(service.id)}
                    >
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <Label
                        htmlFor={`service-${service.id}`}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {service.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedServices.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {selectedServices.length} hizmet seçildi
                  </p>
                )}
              </div>

              {/* Hizmet Bölgesi */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Hizmet Bölgesi (Çoklu Seçim) *
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 border rounded-lg bg-gray-50">
                  {districts.map((district) => (
                    <div
                      key={district.id}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-white cursor-pointer"
                      onClick={() => toggleDistrict(district.id)}
                    >
                      <Checkbox
                        id={`district-${district.id}`}
                        checked={selectedDistricts.includes(district.id)}
                        onCheckedChange={() => toggleDistrict(district.id)}
                      />
                      <Label
                        htmlFor={`district-${district.id}`}
                        className="cursor-pointer text-sm font-normal"
                      >
                        {district.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedDistricts.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {selectedDistricts.length} ilçe seçildi
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={loading}
              >
                {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol ve Antalya Ustası Ol'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

