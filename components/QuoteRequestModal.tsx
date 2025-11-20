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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface QuoteRequestModalProps {
  providerId: string
  providerName: string
}

export function QuoteRequestModal({ providerId, providerName }: QuoteRequestModalProps) {
  const [open, setOpen] = useState(false)
  const [requestDetails, setRequestDetails] = useState('')
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
        return
      }

      // job_requests tablosuna kayıt oluştur
      const { error: insertError } = await supabase.from('job_requests').insert({
        provider_id: providerId,
        user_id: user.id,
        request_details: requestDetails.trim(),
        status: 'pending',
      })

      if (insertError) {
        console.error('İş talebi oluşturma hatası:', insertError)
        setMessage({ type: 'error', text: `İş talebi gönderilirken hata: ${insertError.message}` })
        return
      }

      // Başarılı
      setMessage({ type: 'success', text: 'İş talebiniz başarıyla iletildi!' })
      setRequestDetails('')

      // 2 saniye sonra modal'ı kapat
      setTimeout(() => {
        setOpen(false)
        setMessage(null)
      }, 2000)
    } catch (error: any) {
      console.error('Beklenmeyen hata:', error)
      setMessage({ type: 'error', text: error.message || 'İş talebi gönderilirken bir hata oluştu.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm">
          Teklif İste
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Teklif İste</DialogTitle>
          <DialogDescription>
            {providerName} için iş talebinizi gönderin. Esnaf size en kısa sürede dönüş yapacaktır.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="requestDetails">İş Detayları *</Label>
            <Textarea
              id="requestDetails"
              placeholder="Yapılmasını istediğiniz işi detaylı olarak açıklayın..."
              value={requestDetails}
              onChange={(e) => setRequestDetails(e.target.value)}
              required
              className="min-h-[120px]"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Örn: Mutfak tavanına avize montajı yapılması gerekiyor. Tavan yüksekliği 2.5m.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setRequestDetails('')
                setMessage(null)
              }}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Teklif İste'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

