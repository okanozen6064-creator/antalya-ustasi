'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
} from '@/components/ui/card'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import PageContainer from '@/components/PageContainer'

interface Service {
  id: string
  name: string
}

interface SubService {
  id: string
  name: string
  service_id: string
}

interface District {
  id: number
  name: string
}

export default function PanelProfilPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  
  // Ana hizmet ve alt uzmanlıklar
  const [allServices, setAllServices] = useState<Service[]>([])
  const [selectedMainService, setSelectedMainService] = useState<string>('')
  const [subServices, setSubServices] = useState<SubService[]>([])
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([])
  
  // Hizmet bölgeleri
  const [allDistricts, setAllDistricts] = useState<District[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([])
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  // Sayfa yüklendiğinde mevcut profil verilerini çek
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          setMessage({ type: 'error', text: 'Kullanıcı bilgisi alınamadı. Lütfen giriş yapın.' })
          return
        }

        // Profil bilgilerini çek
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Profil yükleme hatası:', error)
          setMessage({ type: 'error', text: 'Profil bilgileri yüklenirken bir hata oluştu.' })
          return
        }

        if (data) {
          setFirstName(data.first_name || '')
          setLastName(data.last_name || '')
          setBio(data.bio || '')
        }

        // Tüm hizmetleri çek
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, name')
          .order('name', { ascending: true })

        if (servicesError) {
          console.error('Hizmetler yüklenirken hata:', servicesError)
        } else {
          setAllServices(servicesData || [])
        }

        // Esnafın ana hizmetini çek (ilk hizmet ana hizmet olarak kabul edilir)
        const { data: providerServicesData, error: providerServicesError } = await supabase
          .from('provider_services')
          .select('service_id, services(id, name)')
          .eq('provider_id', user.id)
          .limit(1)
          .single()

        if (!providerServicesError && providerServicesData) {
          const mainService = (providerServicesData as any).services
          if (mainService) {
            setSelectedMainService(mainService.id)
            // Ana hizmet seçildiğinde alt uzmanlıkları çek
            fetchSubServices(mainService.id)
          }
        }

        // Esnafın seçili alt uzmanlıklarını çek
        const { data: providerSubServicesData, error: providerSubServicesError } = await supabase
          .from('provider_sub_services')
          .select('sub_service_id, sub_services(id, name)')
          .eq('provider_id', user.id)

        if (!providerSubServicesError && providerSubServicesData) {
          const subServiceIds = (providerSubServicesData || [])
            .map((pss: any) => pss.sub_services?.id)
            .filter((id: string) => id !== null && id !== undefined)
          setSelectedSubServices(subServiceIds)
        }

        // Tüm ilçeleri çek
        const { data: districtsData, error: districtsError } = await supabase
          .from('antalya_districts')
          .select('id, name')
          .order('name', { ascending: true })

        if (districtsError) {
          console.error('İlçeler yüklenirken hata:', districtsError)
        } else {
          setAllDistricts(districtsData || [])
        }

        // Esnafın mevcut ilçelerini çek
        const { data: providerLocationsData, error: providerLocationsError } = await supabase
          .from('provider_locations')
          .select('district_id')
          .eq('provider_id', user.id)

        if (!providerLocationsError && providerLocationsData) {
          const districtIds = (providerLocationsData || []).map((pl: any) => pl.district_id)
          setSelectedDistricts(districtIds)
        }
      } catch (err: any) {
        console.error('Beklenmeyen hata:', err)
        setMessage({ type: 'error', text: 'Profil bilgileri yüklenirken bir hata oluştu.' })
      }
    }

    fetchProfile()
  }, [])

  // Ana hizmet seçildiğinde alt uzmanlıkları çek
  const fetchSubServices = async (serviceId: string) => {
    if (!serviceId) {
      setSubServices([])
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('sub_services')
        .select('id, name, service_id')
        .eq('service_id', serviceId)
        .order('name', { ascending: true })

      if (error) {
        console.error('Alt uzmanlıklar yüklenirken hata:', error)
        setSubServices([])
      } else {
        setSubServices(data || [])
      }
    } catch (err) {
      console.error('Alt uzmanlıklar yüklenirken hata:', err)
      setSubServices([])
    }
  }

  // Ana hizmet değiştiğinde alt uzmanlıkları güncelle
  useEffect(() => {
    if (selectedMainService) {
      fetchSubServices(selectedMainService)
      // Ana hizmet değiştiğinde alt uzmanlık seçimlerini temizle
      setSelectedSubServices([])
    } else {
      setSubServices([])
      setSelectedSubServices([])
    }
  }, [selectedMainService])

  // Profil güncelleme fonksiyonu
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      setLoading(true)

      const supabase = createClient()

      // Mevcut kullanıcıyı al
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setMessage({ type: 'error', text: 'Kullanıcı bilgisi alınamadı. Lütfen giriş yapın.' })
        return
      }

      // 1. Profil bilgilerini güncelle
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          bio: bio || null,
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Profil güncelleme hatası:', updateError)
        setMessage({ type: 'error', text: updateError.message })
        return
      }

      // 2. Ana hizmeti güncelle (provider_services)
      // Önce mevcut kayıtları sil
      const { error: deleteServicesError } = await supabase
        .from('provider_services')
        .delete()
        .eq('provider_id', user.id)

      if (deleteServicesError) {
        console.error('Hizmet silme hatası:', deleteServicesError)
        setMessage({ type: 'error', text: `Hizmetler güncellenirken hata: ${deleteServicesError.message}` })
        return
      }

      // Ana hizmeti ekle
      if (selectedMainService) {
        const { error: insertServiceError } = await supabase
          .from('provider_services')
          .insert({
            provider_id: user.id,
            service_id: selectedMainService,
          })

        if (insertServiceError) {
          console.error('Ana hizmet ekleme hatası:', insertServiceError)
          setMessage({ type: 'error', text: `Ana hizmet eklenirken hata: ${insertServiceError.message}` })
          return
        }
      }

      // 3. Alt uzmanlıkları güncelle (provider_sub_services)
      // Önce mevcut kayıtları sil
      const { error: deleteSubServicesError } = await supabase
        .from('provider_sub_services')
        .delete()
        .eq('provider_id', user.id)

      if (deleteSubServicesError) {
        console.error('Alt uzmanlık silme hatası:', deleteSubServicesError)
        setMessage({ type: 'error', text: `Alt uzmanlıklar güncellenirken hata: ${deleteSubServicesError.message}` })
        return
      }

      // Seçili alt uzmanlıkları ekle
      if (selectedSubServices.length > 0) {
        const insertData = selectedSubServices.map((subServiceId) => ({
          provider_id: user.id,
          sub_service_id: subServiceId,
        }))

        const { error: insertSubServicesError } = await supabase
          .from('provider_sub_services')
          .insert(insertData)

        if (insertSubServicesError) {
          console.error('Alt uzmanlık ekleme hatası:', insertSubServicesError)
          setMessage({ type: 'error', text: `Alt uzmanlıklar eklenirken hata: ${insertSubServicesError.message}` })
          return
        }
      }

      // 4. Hizmet bölgelerini güncelle (provider_locations)
      // Önce mevcut kayıtları sil
      const { error: deleteLocationsError } = await supabase
        .from('provider_locations')
        .delete()
        .eq('provider_id', user.id)

      if (deleteLocationsError) {
        console.error('İlçe silme hatası:', deleteLocationsError)
        setMessage({ type: 'error', text: `İlçeler güncellenirken hata: ${deleteLocationsError.message}` })
        return
      }

      // Seçili ilçeleri ekle
      if (selectedDistricts.length > 0) {
        const insertData = selectedDistricts.map((districtId) => ({
          provider_id: user.id,
          district_id: districtId,
        }))

        const { error: insertLocationsError } = await supabase
          .from('provider_locations')
          .insert(insertData)

        if (insertLocationsError) {
          console.error('İlçe ekleme hatası:', insertLocationsError)
          setMessage({ type: 'error', text: `İlçeler eklenirken hata: ${insertLocationsError.message}` })
          return
        }
      }

      // Başarılı
      setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' })
    } catch (error: any) {
      console.error('Beklenmeyen hata:', error)
      setMessage({ type: 'error', text: error.message || 'Profil güncellenirken bir hata oluştu.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profil Düzenleme</h1>

        {message && (
          <Alert
            variant={message.type === 'error' ? 'destructive' : 'default'}
            className={
              message.type === 'success'
                ? 'text-green-600 border-green-200 bg-green-50'
                : ''
            }
          >
            {message.type === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle>
              {message.type === 'error' ? 'Hata' : 'Başarılı'}
            </AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* 1. Kişisel Bilgiler Kartı */}
          <Card>
            <CardHeader>
              <CardTitle>Kişisel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="bio">Biyografi</Label>
                <Textarea
                  id="bio"
                  placeholder="Kendinizi kısaca tanıtın"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Hizmet ve Uzmanlık Kartı */}
          <Card>
            <CardHeader>
              <CardTitle>Hizmet ve Uzmanlık</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainService">Ana Hizmet *</Label>
                <Select
                  value={selectedMainService}
                  onValueChange={setSelectedMainService}
                  required
                >
                  <SelectTrigger id="mainService" className="w-full">
                    <SelectValue placeholder="Ana hizmetinizi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {allServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alt Uzmanlıklar */}
              {selectedMainService && subServices.length > 0 && (
                <div className="space-y-2">
                  <Label>Alt Uzmanlıklar (Birden fazla seçebilirsiniz)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
                    {subServices.map((subService) => (
                      <div key={subService.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subservice-${subService.id}`}
                          checked={selectedSubServices.includes(subService.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSubServices([...selectedSubServices, subService.id])
                            } else {
                              setSelectedSubServices(selectedSubServices.filter((id) => id !== subService.id))
                            }
                          }}
                        />
                        <Label
                          htmlFor={`subservice-${subService.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {subService.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMainService && subServices.length === 0 && (
                <p className="text-sm text-gray-500">
                  Bu hizmet için alt uzmanlık bulunmamaktadır.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 3. Hizmet Bölgeleri Kartı */}
          <Card>
            <CardHeader>
              <CardTitle>Hizmet Bölgeleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Hizmet Verdiğiniz İlçeler (Birden fazla seçebilirsiniz)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border rounded-lg bg-gray-50">
                  {allDistricts.map((district) => (
                    <div key={district.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`district-${district.id}`}
                        checked={selectedDistricts.includes(district.id)}
                        onCheckedChange={(checked) => {
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
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </form>
      </div>
    </PageContainer>
  )
}
