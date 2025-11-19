'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

type Status = 'pending' | 'responded' | 'completed' | 'cancelled'

interface StatusUpdaterProps {
  requestId: number | string
  initialStatus: Status | string
}

const statusMap: { [key in Status]: string } = {
  pending: 'Beklemede',
  responded: 'Yanıtlandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
}

export default function StatusUpdater({ requestId, initialStatus }: StatusUpdaterProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(initialStatus as string)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const handleStatusChange = async (newStatus: string) => {
    const status = newStatus as Status

    if (status === currentStatus) return // Aynı statü ise işlem yapma

    setLoading(true)
    setMessage(null)

    // Supabase'de `status` kolonunu güncelleme
    const { error } = await supabase
      .from('job_requests')
      .update({ status: status })
      .eq('id', requestId)
    // RLS burada provider_id'nin güncelleyen kullanıcıya eşit olup olmadığını kontrol etmeli!

    setLoading(false)

    if (error) {
      console.error('Durum Güncelleme Hatası:', error)
      setMessage({ type: 'error', text: `Kanka, durum güncellenirken hata oluştu: ${error.message}` })
      setTimeout(() => setMessage(null), 5000)
      return
    }

    setCurrentStatus(status)
    setMessage({
      type: 'success',
      text: `Talep ID #${requestId} durumu başarıyla "${statusMap[status]}" olarak güncellendi.`,
    })
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <div className="space-y-2">
      <Select value={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Durumu Güncelle" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(statusMap).map(([key, value]) => (
            <SelectItem key={key} value={key} disabled={loading}>
              {value}
              {key === currentStatus && ' (Mevcut)'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {message && (
        <Alert
          variant={message.type === 'error' ? 'destructive' : 'default'}
          className={
            message.type === 'success'
              ? 'text-green-600 border-green-200 bg-green-50 text-xs'
              : 'text-xs'
          }
        >
          {message.type === 'error' ? (
            <AlertCircle className="h-3 w-3" />
          ) : (
            <CheckCircle2 className="h-3 w-3" />
          )}
          <AlertDescription className="text-xs">{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

