'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReviewFormProps {
  providerId: string
}

export function ReviewForm({ providerId }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [comment, setComment] = useState('')
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
        setMessage({ type: 'error', text: 'Yorum yapmak için lütfen giriş yapın.' })
        setTimeout(() => {
          router.push('/giris-yap')
        }, 2000)
        return
      }

      // Form validasyonu
      if (rating === 0) {
        setMessage({ type: 'error', text: 'Lütfen bir puan seçiniz.' })
        return
      }

      if (!comment.trim()) {
        setMessage({ type: 'error', text: 'Lütfen yorumunuzu yazınız.' })
        return
      }

      // reviews tablosuna kayıt oluştur
      const { error: insertError } = await supabase.from('reviews').insert({
        provider_id: providerId,
        user_id: user.id,
        rating: rating,
        comment: comment.trim(),
      })

      if (insertError) {
        console.error('Yorum oluşturma hatası:', insertError)
        setMessage({ type: 'error', text: `Yorum kaydedilirken hata: ${insertError.message}` })
        return
      }

      // Başarılı
      setMessage({ type: 'success', text: 'Yorumunuz kaydedildi!' })
      setRating(0)
      setComment('')

      // Sayfayı yenile (yeni yorumu görmek için)
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error('Beklenmeyen hata:', error)
      setMessage({ type: 'error', text: error.message || 'Yorum kaydedilirken bir hata oluştu.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yorum Yap</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label>Puan *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  disabled={loading}
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
                <span className="ml-2 text-sm text-gray-600">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Yorumunuz *</Label>
            <Textarea
              id="comment"
              placeholder="Yorumunuzu buraya yazın..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="min-h-[100px]"
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading || rating === 0 || !comment.trim()}>
            {loading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

