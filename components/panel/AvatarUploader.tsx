'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null
  userId: string
  firstName?: string | null
  lastName?: string | null
  onUploadSuccess?: (url: string) => void
}

export function AvatarUploader({
  currentAvatarUrl,
  userId,
  firstName,
  lastName,
  onUploadSuccess,
}: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = () => {
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      setError('Sadece resim dosyaları yüklenebilir.')
      return
    }

    // Dosya boyutu kontrolü (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Dosya boyutu 2MB\'dan küçük olmalıdır.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Dosya adını oluştur
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Eski avatar varsa sil
      if (avatarUrl) {
        try {
          const oldPath = avatarUrl.split('/').slice(-2).join('/')
          await supabase.storage.from('avatars').remove([oldPath])
        } catch (err) {
          // Eski dosya yoksa hata verme
          console.warn('Eski avatar silinemedi:', err)
        }
      }

      // Storage'a yükle
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        console.error('Upload hatası:', uploadError)
        setError(`Yükleme hatası: ${uploadError.message}`)
        setUploading(false)
        return
      }

      // Public URL'i al
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      if (!urlData?.publicUrl) {
        setError('Fotoğraf URL\'i alınamadı.')
        setUploading(false)
        return
      }

      // Veritabanını güncelle
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', userId)

      if (dbError) {
        console.error('DB güncelleme hatası:', dbError)
        // Storage'dan sil (rollback)
        await supabase.storage.from('avatars').remove([filePath])
        setError(`Veritabanı güncelleme hatası: ${dbError.message}`)
        setUploading(false)
        return
      }

      // Başarılı
      setAvatarUrl(urlData.publicUrl)
      onUploadSuccess?.(urlData.publicUrl)
      setError(null)
    } catch (err: any) {
      console.error('Beklenmeyen hata:', err)
      setError(err.message || 'Avatar yüklenirken bir hata oluştu.')
    } finally {
      setUploading(false)
      // Input'u temizle
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24 border-4 border-indigo-100">
        <AvatarImage src={avatarUrl || undefined} alt="Profil Fotoğrafı" />
        <AvatarFallback className="bg-indigo-600 text-white text-2xl">
          {getInitials()}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          id="avatar-upload"
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Yükleniyor...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Fotoğraf Yükle
            </>
          )}
        </Button>
        {error && (
          <p className="text-sm text-red-600 text-center max-w-xs">{error}</p>
        )}
        <p className="text-xs text-gray-500 text-center">
          JPG, PNG veya GIF (Max 2MB)
        </p>
      </div>
    </div>
  )
}



