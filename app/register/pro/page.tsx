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
import { AlertCircle, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
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

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  businessName: string
  taxNumber: string
  selectedServices: string[]
  selectedDistricts: number[]
}

export default function ProRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    taxNumber: '',
    selectedServices: [],
    selectedDistricts: [],
  })
  const [services, setServices] = useState<Service[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Verileri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        const [servicesResult, districtsResult] = await Promise.all([
          supabase.from('services').select('id, name').order('name', { ascending: true }),
          supabase.from('antalya_districts').select('id, name').order('name', { ascending: true }),
        ])

        if (servicesResult.error) {
          console.error('Hizmetler yüklenirken hata:', servicesResult.error)
        } else {
          setServices(servicesResult.data || [])
        }

        if (districtsResult.error) {
          console.error('İlçeler yüklenirken hata:', districtsResult.error)
        } else {
          setDistricts(districtsResult.data || [])
        }
      } catch (err) {
        console.error('Beklenmeyen hata:', err)
      }
    }

    fetchData()
  }, [])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }))
  }

  const toggleDistrict = (districtId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedDistricts: prev.selectedDistricts.includes(districtId)
        ? prev.selectedDistricts.filter((id) => id !== districtId)
        : [...prev.selectedDistricts, districtId],
    }))
  }

  const validateStep = (step: number): boolean => {
    setErrorMessage('')
    
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setErrorMessage('Ad ve Soyad gereklidir!')
        return false
      }
      if (!formData.email.trim()) {
        setErrorMessage('E-posta gereklidir!')
        return false
      }
      if (formData.password.length < 6) {
        setErrorMessage('Şifre en az 6 karakter olmalıdır!')
        return false
      }
    }
    
    if (step === 2) {
      if (!formData.taxNumber.trim()) {
        setErrorMessage('Vergi Numarası gereklidir!')
        return false
      }
      if (formData.selectedServices.length === 0) {
        setErrorMessage('En az bir hizmet seçmelisiniz!')
        return false
      }
      if (formData.selectedDistricts.length === 0) {
        setErrorMessage('En az bir ilçe seçmelisiniz!')
        return false
      }
    }
    
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setErrorMessage('')
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    setErrorMessage('')
    setLoading(true)

    try {
      const supabase = createClient()

      // ADIM 1: Kullanıcıyı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            is_provider: true,
          },
        },
      })

      if (authError || !authData.user) {
        // Hata mesajlarını Türkçe ve açıklayıcı hale getir
        let userFriendlyMessage = authError?.message || 'Kullanıcı oluşturulamadı!'
        
        if (authError) {
          if (authError.message.includes('already registered') || authError.message.includes('already exists') || authError.message.includes('User already registered')) {
            userFriendlyMessage = 'Bu e-posta adresi zaten kayıtlı. Lütfen giriş yap sayfasından giriş yapın veya farklı bir e-posta adresi kullanın.'
          } else if (authError.message.includes('Invalid email')) {
            userFriendlyMessage = 'Geçersiz e-posta adresi. Lütfen doğru bir e-posta adresi girin.'
          } else if (authError.message.includes('Password')) {
            userFriendlyMessage = 'Şifre çok kısa. Şifreniz en az 6 karakter olmalıdır.'
          } else if (authError.message.includes('email')) {
            userFriendlyMessage = 'E-posta adresi ile ilgili bir hata oluştu. Lütfen tekrar deneyin.'
          }
        }
        
        setErrorMessage(userFriendlyMessage)
        setLoading(false)
        return
      }

      const userId = authData.user.id

      // ADIM 2: Profiles tablosunu güncelle
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
          business_name: formData.businessName || null,
          tax_number: formData.taxNumber,
          is_provider: true,
        })
        .eq('id', userId)

      if (profileError) {
        setErrorMessage(`Profil güncellenirken hata: ${profileError.message}`)
        setLoading(false)
        return
      }

      // ADIM 3: Hizmetleri ekle
      const serviceInserts = formData.selectedServices.map((serviceId) => ({
        provider_id: userId,
        service_id: serviceId,
      }))

      const { error: servicesError } = await supabase
        .from('provider_services')
        .insert(serviceInserts)

      if (servicesError) {
        setErrorMessage(`Hizmetler eklenirken hata: ${servicesError.message}`)
        setLoading(false)
        return
      }

      // ADIM 4: İlçeleri ekle
      const locationInserts = formData.selectedDistricts.map((districtId) => ({
        provider_id: userId,
        district_id: districtId,
      }))

      const { error: locationsError } = await supabase
        .from('provider_locations')
        .insert(locationInserts)

      if (locationsError) {
        setErrorMessage(`İlçeler eklenirken hata: ${locationsError.message}`)
        setLoading(false)
        return
      }

      // Başarılı
      router.push(`/register/success?email=${encodeURIComponent(formData.email)}`)
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

  const progressPercentage = (currentStep / 3) * 100

  return (
    <PageContainer>
      <div className="py-12 max-w-4xl mx-auto">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-indigo-600">
              Antalya'nın En İyi Ustaları Arasına Katılın
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Profesyonel kayıt formunu adım adım doldurun
            </p>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Adım {currentStep} / 3
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progressPercentage)}% Tamamlandı
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Adım 1: Kimlik Bilgileri */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Kimlik Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Adınız"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Soyadınız"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
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
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Şifre *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="En az 6 karakter"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* Adım 2: İş Bilgileri */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  İş Bilgileri
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">İşletme Adı</Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="İşletme adınız (opsiyonel)"
                      value={formData.businessName}
                      onChange={(e) => updateFormData('businessName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxNumber">Vergi Numarası *</Label>
                    <Input
                      id="taxNumber"
                      type="text"
                      placeholder="Vergi numaranız"
                      value={formData.taxNumber}
                      onChange={(e) => updateFormData('taxNumber', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Uzmanlık Alanları (Çoklu Seçim) *
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 border rounded-lg bg-gray-50">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-white cursor-pointer"
                        onClick={() => toggleService(service.id)}
                      >
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={formData.selectedServices.includes(service.id)}
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
                  {formData.selectedServices.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {formData.selectedServices.length} hizmet seçildi
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Hizmet Bölgesi (Çoklu Seçim) *
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 border rounded-lg bg-gray-50">
                    {districts.map((district) => (
                      <div
                        key={district.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-white cursor-pointer"
                        onClick={() => toggleDistrict(district.id)}
                      >
                        <Checkbox
                          id={`district-${district.id}`}
                          checked={formData.selectedDistricts.includes(district.id)}
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
                  {formData.selectedDistricts.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {formData.selectedDistricts.length} ilçe seçildi
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Adım 3: Onay */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Kayıt Özeti
                </h3>
                
                <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Kişisel Bilgiler</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Ad Soyad:</strong> {formData.firstName} {formData.lastName}</p>
                      <p><strong>E-posta:</strong> {formData.email}</p>
                      {formData.phone && <p><strong>Telefon:</strong> {formData.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">İşletme Bilgileri</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {formData.businessName && <p><strong>İşletme Adı:</strong> {formData.businessName}</p>}
                      <p><strong>Vergi Numarası:</strong> {formData.taxNumber}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Uzmanlık Alanları</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedServices.map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId)
                        return (
                          <span key={serviceId} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {service?.name}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Hizmet Bölgesi</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedDistricts.map((districtId) => {
                        const district = districts.find((d) => d.id === districtId)
                        return (
                          <span key={districtId} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                            {district?.name}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <Alert className="bg-indigo-50 border-indigo-200">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <AlertDescription className="text-indigo-800">
                    Bilgilerinizi kontrol edin. "Kaydı Tamamla" butonuna tıkladığınızda kayıt işlemi başlayacaktır.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Navigasyon Butonları */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || loading}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Geri
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                >
                  İleri
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {loading ? 'Kayıt Yapılıyor...' : 'Kaydı Tamamla'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
