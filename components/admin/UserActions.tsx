'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreVertical, CheckCircle2, XCircle, Eye, Loader2 } from 'lucide-react'
import { toggleProviderStatus } from '@/app/actions/admin'

interface UserActionsProps {
  userId: string
  isProvider: boolean
  isVerified: boolean
  profile: {
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
    bio: string | null
    tax_number: string | null
    business_name: string | null
  }
}

export function UserActions({ userId, isProvider, isVerified, profile }: UserActionsProps) {
  const [loading, setLoading] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const router = useRouter()

  const handleToggleStatus = async (newStatus: boolean) => {
    setLoading(true)
    try {
      const result = await toggleProviderStatus(userId, newStatus)
      if (result.success) {
        router.refresh()
        // Basit bir bildirim göster
        alert('Kullanıcı durumu güncellendi.')
      } else {
        alert(result.error || 'İşlem başarısız oldu')
      }
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isProvider && !isVerified && (
            <DropdownMenuItem
              onClick={() => handleToggleStatus(true)}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Onayla
            </DropdownMenuItem>
          )}
          {isProvider && isVerified && (
            <DropdownMenuItem
              onClick={() => handleToggleStatus(false)}
              disabled={loading}
              variant="destructive"
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Engelle / Onayı Kaldır
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDetailOpen(true)} className="gap-2">
            <Eye className="h-4 w-4" />
            Detayları Gör
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {profile.first_name} {profile.last_name} - Detaylar
            </DialogTitle>
            <DialogDescription>Kullanıcı detay bilgileri</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">E-posta</h4>
              <p className="text-gray-900">{profile.email || '-'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">Telefon</h4>
              <p className="text-gray-900">{profile.phone || '-'}</p>
            </div>
            {isProvider && (
              <>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">İşletme Adı</h4>
                  <p className="text-gray-900">{profile.business_name || '-'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">Vergi Numarası</h4>
                  <p className="text-gray-900">{profile.tax_number || '-'}</p>
                </div>
              </>
            )}
            <div>
              <h4 className="font-semibold text-sm text-gray-500 mb-1">Biyografi</h4>
              <p className="text-gray-900 whitespace-pre-wrap">
                {profile.bio || 'Biyografi eklenmemiş'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

