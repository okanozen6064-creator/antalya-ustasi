'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface PortfolioUploaderProps {
  onUploadSuccess?: () => void
}

export default function PortfolioUploader({ onUploadSuccess }: PortfolioUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Sadece resim dosyaları yüklenebilir.' })
      return
    }

    // Dosya boyutu kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Dosya boyutu 5MB\'dan küçük olmalıdır.' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      // Kullanıcı bilgisini al
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setMessage({ type: 'error', text: 'Kullanıcı bilgisi alınamadı. Lütfen giriş yapın.' })
        setUploading(false)
        return
      }

      // Dosya adını oluştur (unique olması için timestamp ekle)
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const filePath = `public/${fileName}`

      // Storage'a yükle
      const { error: uploadError } = await supabase.storage
        .from('portfolio_gallery')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload hatası:', uploadError)
        setMessage({ type: 'error', text: `Yükleme hatası: ${uploadError.message}` })
        setUploading(false)
        return
      }

      // Public URL'i al
      const { data: urlData } = supabase.storage
        .from('portfolio_gallery')
        .getPublicUrl(filePath)

      if (!urlData?.publicUrl) {
        setMessage({ type: 'error', text: 'Fotoğraf URL\'i alınamadı.' })
        setUploading(false)
        return
      }

      // Veritabanına kaydet
      const { error: dbError } = await supabase
        .from('portfolio_photos')
        .insert({
          provider_id: user.id,
          photo_url: urlData.publicUrl,
        })

      if (dbError) {
        console.error('DB kayıt hatası:', dbError)
        // Storage'dan sil (rollback)
        await supabase.storage.from('portfolio_gallery').remove([filePath])
        setMessage({ type: 'error', text: `Veritabanı kayıt hatası: ${dbError.message}` })
        setUploading(false)
        return
      }

      // Başarılı
      setMessage({ type: 'success', text: 'Fotoğraf başarıyla yüklendi!' })
      
      // Input'u temizle
      e.target.value = ''

      // Callback çağır
      if (onUploadSuccess) {
        onUploadSuccess()
      }

      // Mesajı 3 saniye sonra temizle
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error: any) {
      console.error('Beklenmeyen hata:', error)
      setMessage({ type: 'error', text: error.message || 'Fotoğraf yüklenirken bir hata oluştu.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="space-y-2">
        <Label htmlFor="portfolio-upload" className="text-lg font-semibold">
          Portfolyo Fotoğrafı Yükle
        </Label>
        <p className="text-sm text-muted-foreground">
          Yaptığın işlerin en iyi görsellerini yükle. Maksimum dosya boyutu: 5MB
        </p>
      </div>

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

      <div className="flex items-center gap-4">
        <Input
          id="portfolio-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <Label
          htmlFor="portfolio-upload"
          className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Yükleniyor...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Fotoğraf Seç</span>
            </>
          )}
        </Label>
      </div>
    </div>
  )
}

