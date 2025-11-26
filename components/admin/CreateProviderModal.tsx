'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProviderManually } from '@/app/actions/admin-create-user'
import { createClient } from '@/lib/supabase/client'
import { Plus } from 'lucide-react'

interface Service {
  id: number
  name: string
}

interface District {
  id: number
  name: string
}

export function CreateProviderModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('Antalya2024')
  const [businessName, setBusinessName] = useState('')
  const [serviceId, setServiceId] = useState<string>('')
  const [districtId, setDistrictId] = useState<string>('')

  // Data state
  const [services, setServices] = useState<Service[]>([])
  const [districts, setDistricts] = useState<District[]>([])

  // Verileri çek
  useEffect(() => {
    if (open) {
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
    }
  }, [open])

  // Form sıfırla
  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setPassword('Antalya2024')
    setBusinessName('')
    setServiceId('')
    setDistrictId('')
    setError(null)
    setSuccess(false)
  }

  // Modal kapanınca formu sıfırla
  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Validasyon
    if (!firstName || !lastName || !email || !phone || !password || !serviceId || !districtId) {
      setError('Lütfen tüm zorunlu alanları doldurun.')
      setLoading(false)
      return
    }

    try {
      // FormData oluştur
      const formData = new FormData()
      formData.append('firstName', firstName)
      formData.append('lastName', lastName)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('password', password)
      if (businessName) {
        formData.append('businessName', businessName)
      }
      formData.append('serviceId', serviceId)
      formData.append('districtId', districtId)

      // Server Action'ı çağır
      const result = await createProviderManually(formData)

      if (result.success) {
        setSuccess(true)
        // 2 saniye sonra modalı kapat
        setTimeout(() => {
          setOpen(false)
          // Sayfayı yenile (revalidatePath zaten yapıyor ama client-side refresh için)
          window.location.reload()
        }, 1500)
      } else {
        setError(result.error || 'Bir hata oluştu.')
      }
    } catch (err: any) {
      console.error('Form gönderme hatası:', err)
      setError(err.message || 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Yeni Usta Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Usta Oluştur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ad Soyad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Ad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ahmet"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Soyad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Yılmaz"
                required
              />
            </div>
          </div>

          {/* E-posta */}
          <div className="space-y-2">
            <Label htmlFor="email">
              E-posta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmet@example.com"
              required
            />
          </div>

          {/* Telefon */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Telefon <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0555 123 45 67"
              required
            />
          </div>

          {/* Şifre */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Şifre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Antalya2024"
              required
            />
            <p className="text-xs text-gray-500">Varsayılan şifre: Antalya2024</p>
          </div>

          {/* İşletme Adı */}
          <div className="space-y-2">
            <Label htmlFor="businessName">İşletme Adı (Opsiyonel)</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Yılmaz Elektrik"
            />
          </div>

          {/* Ana Hizmet */}
          <div className="space-y-2">
            <Label htmlFor="serviceId">
              Ana Hizmet <span className="text-red-500">*</span>
            </Label>
            <Select value={serviceId} onValueChange={setServiceId} required>
              <SelectTrigger id="serviceId">
                <SelectValue placeholder="Hizmet seçin" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hizmet Bölgesi */}
          <div className="space-y-2">
            <Label htmlFor="districtId">
              Hizmet Bölgesi <span className="text-red-500">*</span>
            </Label>
            <Select value={districtId} onValueChange={setDistrictId} required>
              <SelectTrigger id="districtId">
                <SelectValue placeholder="İlçe seçin" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id.toString()}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hata Mesajı */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Başarı Mesajı */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              ✅ Usta başarıyla oluşturuldu!
            </div>
          )}

          {/* Butonlar */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Oluşturuluyor...' : 'Ustayı Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}



