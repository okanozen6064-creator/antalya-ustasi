'use client'

import { useState, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { registerProvider } from '@/app/actions/auth'
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
import { AlertCircle, ChevronLeft, ChevronRight, CheckCircle2, Check } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import LegalAgreement from '@/components/auth/LegalAgreement'

interface Service {
  id: string
  name: string
}

interface District {
  id: number
  name: string
}

interface FormDataState {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  businessName: string
  taxNumber: string
  taxPlateFile: File | null
  selectedServices: string[]
  selectedDistricts: number[]
}

const initialState = {
  success: false,
  error: undefined,
  message: undefined,
}

export default function ProRegisterPage() {
  const [state, formAction] = useFormState(registerProvider, initialState)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormDataState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    taxNumber: '',
    taxPlateFile: null,
    selectedServices: [],
    selectedDistricts: [],
  })
  const [services, setServices] = useState<Service[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [legalAccepted, setLegalAccepted] = useState(false)
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

        if (servicesResult.data) setServices(servicesResult.data)
        if (districtsResult.data) setDistricts(districtsResult.data)
      } catch (err) {
        console.error('Beklenmeyen hata:', err)
      }
    }

    fetchData()
  }, [])

  // Server Action Başarı Durumu
  useEffect(() => {
    if (state.success) {
      router.push('/register/success')
    } else if (state.error) {
      if (typeof state.error === 'string') {
        setErrorMessage(state.error)
      } else {
        setErrorMessage('Lütfen formdaki hataları düzeltin.')
      }
    }
  }, [state, router])

  const updateFormData = (field: keyof FormDataState, value: any) => {
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
      if (formData.phone.trim()) {
        const phoneRegex = /^5[0-9]{9}$/
        const cleanPhone = formData.phone.replace(/\s/g, '')
        if (!phoneRegex.test(cleanPhone)) {
          setErrorMessage('Telefon numarası 5 ile başlamalı ve 10 haneli olmalı (Örn: 5321234567).')
          return false
        }
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

  const handleFinalSubmit = () => {
    const data = new FormData()
    data.append('full_name', `${formData.firstName} ${formData.lastName}`)
    data.append('email', formData.email)
    data.append('password', formData.password)
    data.append('phone', formData.phone)
    data.append('tax_number', formData.taxNumber)
    data.append('business_name', formData.businessName)
    data.append('legalAccepted', legalAccepted.toString())

    formData.selectedServices.forEach(id => data.append('service_ids', id))
    formData.selectedDistricts.forEach(id => data.append('district_ids', id.toString()))

    if (formData.taxPlateFile) {
      data.append('tax_plate_file', formData.taxPlateFile)
    }

    formAction(data)
  }

  const progressPercentage = (currentStep / 3) * 100

  const getFieldError = (fieldName: string) => {
    if (state.error && typeof state.error === 'object' && state.error[fieldName]) {
      return state.error[fieldName][0]
    }
    return null
  }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      {/* SOL: FORM */}
      <div className="flex items-center justify-center py-12 px-4 bg-white overflow-y-auto h-screen">
        <div className="w-full max-w-2xl">
          <Card className="border-0 shadow-none">
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

              {/* Global Error Message */}
              {(errorMessage || (state.error && typeof state.error === 'string')) && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Hata</AlertTitle>
                  <AlertDescription>
                    {errorMessage || (state.error as string)}
                  </AlertDescription>
                </Alert>
              )}

              {/* Zod Field Errors Summary */}
              {state.error && typeof state.error === 'object' && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validasyon Hatası</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {Object.entries(state.error).map(([key, errors]) => (
                        <li key={key}>{errors[0]}</li>
                      ))}
                    </ul>
                  </AlertDescription>
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
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        className={getFieldError('full_name') ? 'border-red-500' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Soyad *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        className={getFieldError('full_name') ? 'border-red-500' : ''}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className={getFieldError('email') ? 'border-red-500' : ''}
                      />
                      {getFieldError('email') && <p className="text-xs text-red-500">{getFieldError('email')}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="5321234567"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d\s]/g, '')
                          updateFormData('phone', value)
                        }}
                        className={getFieldError('phone') ? 'border-red-500' : ''}
                      />
                      {getFieldError('phone') && <p className="text-xs text-red-500">{getFieldError('phone')}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Şifre *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className={getFieldError('password') ? 'border-red-500' : ''}
                    />
                    {getFieldError('password') && <p className="text-xs text-red-500">{getFieldError('password')}</p>}
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
                        value={formData.businessName}
                        onChange={(e) => updateFormData('businessName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">Vergi Numarası / TC Kimlik No *</Label>
                      <Input
                        id="taxNumber"
                        value={formData.taxNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          updateFormData('taxNumber', value)
                        }}
                        maxLength={11}
                        className={getFieldError('tax_number') ? 'border-red-500' : ''}
                      />
                      {getFieldError('tax_number') && <p className="text-xs text-red-500">{getFieldError('tax_number')}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxPlate">
                      Vergi Levhası Yükle * <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="taxPlate"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        updateFormData('taxPlateFile', file)
                      }}
                    />
                    {formData.taxPlateFile && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ Dosya seçildi: {formData.taxPlateFile.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Uzmanlık Alanları (Çoklu Seçim) *
                    </h4>
                    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 border rounded-lg bg-gray-50 ${getFieldError('service_ids') ? 'border-red-500' : ''}`}>
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
                    {getFieldError('service_ids') && <p className="text-xs text-red-500">{getFieldError('service_ids')}</p>}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Hizmet Bölgesi (Çoklu Seçim) *
                    </h4>
                    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-4 border rounded-lg bg-gray-50 ${getFieldError('district_ids') ? 'border-red-500' : ''}`}>
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
                    {getFieldError('district_ids') && <p className="text-xs text-red-500">{getFieldError('district_ids')}</p>}
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
                        {formData.taxPlateFile && (
                          <p><strong>Vergi Levhası:</strong> {formData.taxPlateFile.name}</p>
                        )}
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

                  <LegalAgreement onAccept={setLegalAccepted} />

                  {!legalAccepted && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Lütfen sözleşmeyi okuyup onaylayın
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Navigasyon Butonları */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
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
                    onClick={handleFinalSubmit}
                    disabled={!legalAccepted}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Kaydı Tamamla
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SAĞ: İŞ ORTAĞIMIZ OLUN */}
      <div className="hidden lg:block relative bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?q=80&w=2000')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center h-full p-12 text-white">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            İşinizi Büyütün,<br />
            Müşteriye Koşmayın.
          </h2>

          <ul className="space-y-4 mb-12">
            <li className="flex items-center gap-3 text-lg text-slate-200">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              Binlerce hazır müşteri
            </li>
            <li className="flex items-center gap-3 text-lg text-slate-200">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              Komisyonsuz teklif imkanı
            </li>
            <li className="flex items-center gap-3 text-lg text-slate-200">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              Güvenli ödeme altyapısı
            </li>
          </ul>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <p className="text-2xl font-bold text-white mb-1">1.200+</p>
            <p className="text-slate-300 text-sm">Usta şu an bizimle çalışıyor.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
