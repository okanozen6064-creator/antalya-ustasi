'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface CreateJobModalProps {
  providerId: string
  providerName: string
}

export function CreateJobModal({ providerId, providerName }: CreateJobModalProps) {
  const [open, setOpen] = useState(false)
  const [requestDetails, setRequestDetails] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      setLoading(true)

      const supabase = createClient()

      // Giriş kontrolü
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setOpen(false)
        router.push('/giris-yap')
        return
      }

      // Form validasyonu
      if (!requestDetails.trim()) {
        setMessage({ type: 'error', text: 'Lütfen iş detaylarınızı giriniz.' })
        setLoading(false)
        return
      }

      // job_requests tablosuna kayıt oluştur
      const { data: newJobRequest, error: insertError } = await supabase
        .from('job_requests')
        .insert({
          provider_id: providerId,
          user_id: user.id,
          request_details: requestDetails.trim(),
          status: 'pending',
          // preferred_date varsa ekle (eğer tabloda bu kolon varsa)
          // preferred_date: preferredDate || null,
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('İş talebi oluşturma hatası:', insertError)
        setMessage({
          type: 'error',
          text: `İş talebi gönderilirken hata: ${insertError.message}`,
        })
        setLoading(false)
        return
      }

      // Başarılı - Sohbet sayfasına yönlendir
      setMessage({ type: 'success', text: 'İş talebiniz başarıyla oluşturuldu! Yönlendiriliyorsunuz...' })

      // 1 saniye sonra sohbet sayfasına yönlendir
      setTimeout(() => {
        setOpen(false)
        setRequestDetails('')
        setPreferredDate('')
        setMessage(null)
        if (newJobRequest?.id) {
          router.push(`/panel/mesajlar/${newJobRequest.id}`)
        }
      }, 1000)
    } catch (error: any) {
      console.error('Beklenmeyen hata:', error)
      setMessage({
        type: 'error',
        text: error.message || 'İş talebi gönderilirken bir hata oluştu.',
      })
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Hemen Teklif İste
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {providerName} adlı ustadan teklif isteyin
          </DialogTitle>
          <DialogDescription>
            İş detaylarınızı belirtin, usta size en kısa sürede dönüş yapacaktır.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {message && (
            <Alert
              className={
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }
            >
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="requestDetails">
              İşin Tanımı <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="requestDetails"
              placeholder="Ne yapılması gerekiyor? Detay verin..."
              value={requestDetails}
              onChange={(e) => setRequestDetails(e.target.value)}
              required
              className="min-h-[140px] resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Örn: Mutfak tavanına avize montajı yapılması gerekiyor. Tavan yüksekliği 2.5m, elektrik
              bağlantısı mevcut.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDate">Tercih Edilen Tarih (Opsiyonel)</Label>
            <Input
              id="preferredDate"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-gray-500">
              İşin yapılmasını tercih ettiğiniz tarihi belirtin (isteğe bağlı)
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setRequestDetails('')
                setPreferredDate('')
                setMessage(null)
              }}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                'Talebi Gönder'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


