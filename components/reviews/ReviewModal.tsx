'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { submitReview } from '@/app/actions/jobs'

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestId: string
  providerId: string
  providerName: string
}

export function ReviewModal({
  open,
  onOpenChange,
  requestId,
  providerId,
  providerName,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validasyon
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Lütfen bir puan seçiniz.' })
      return
    }

    if (!comment.trim()) {
      setMessage({ type: 'error', text: 'Lütfen yorumunuzu yazınız.' })
      return
    }

    setLoading(true)

    try {
      const result = await submitReview(requestId, providerId, rating, comment)

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Değerlendirmeniz kaydedildi!' })
        // Başarılı olunca modal'ı kapat
        setTimeout(() => {
          setRating(0)
          setHoveredRating(0)
          setComment('')
          setMessage(null)
          onOpenChange(false)
          // Sayfayı yenile
          window.location.reload()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: result.message || 'Değerlendirme kaydedilirken bir hata oluştu.' })
      }
    } catch (error: any) {
      console.error('Beklenmeyen hata:', error)
      setMessage({ type: 'error', text: error.message || 'Bir hata oluştu.' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setRating(0)
      setHoveredRating(0)
      setComment('')
      setMessage(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Hizmet nasıldı?
          </DialogTitle>
          <DialogDescription>
            İşiniz tamamlandı. Lütfen ustanızı değerlendirin.
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

          {/* Yıldız Rating */}
          <div className="space-y-2">
            <Label>Puan <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={loading}
                  className="focus:outline-none transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Yorum Alanı */}
          <div className="space-y-2">
            <Label htmlFor="comment">
              Yorumunuz <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              placeholder="Ustanız hakkında düşüncelerinizi paylaşın..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="min-h-[120px] resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Yorumunuz diğer müşterilere yardımcı olacaktır.
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading || rating === 0 || !comment.trim()} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                'Değerlendir ve Bitir'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

