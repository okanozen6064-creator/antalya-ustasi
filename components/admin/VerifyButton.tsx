'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'

interface VerifyButtonProps {
  userId: string
  isVerified: boolean
}

export function VerifyButton({ userId, isVerified }: VerifyButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleVerify = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/admin/api/users/${userId}/verify`, {
        method: 'POST',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('İşlem başarısız oldu')
      }
    } catch (error) {
      console.error('Hata:', error)
      alert('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleVerify}
      variant={isVerified ? 'destructive' : 'default'}
      size="sm"
      disabled={loading}
    >
      {isVerified ? (
        <>
          <XCircle className="h-4 w-4 mr-1" />
          Engelle
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Onayla
        </>
      )}
    </Button>
  )
}


