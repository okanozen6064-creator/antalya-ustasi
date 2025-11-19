'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const INACTIVITY_TIMEOUT = 4 * 60 * 60 * 1000 // 4 saat (14400000 ms)

export function AutoLogoutProvider() {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    let isMounted = true

    // Kullanıcının giriş yapıp yapmadığını kontrol et
    const checkUserAndSetupTimer = async () => {
      try {
        const {
          data: { user },
        } = await supabaseRef.current.auth.getUser()

        // Kullanıcı yoksa, event listener'ları ekleme
        if (!user || !isMounted) {
          return
        }

        // Aktivite olaylarını dinle
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
        
        const resetTimer = () => {
          // Önceki timer'ı temizle
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }

          // Yeni timer başlat
          timeoutRef.current = setTimeout(async () => {
            if (!isMounted) return

            try {
              // Kullanıcı hala giriş yapmış mı kontrol et
              const {
                data: { user: currentUser },
              } = await supabaseRef.current.auth.getUser()

              if (currentUser) {
                // Logout yap
                await supabaseRef.current.auth.signOut()

                // Toast mesajı için query parametresi ile yönlendir
                router.push('/giris-yap?message=inactivity_logout')
                router.refresh()
              }
            } catch (error) {
              console.error('Logout hatası:', error)
            }
          }, INACTIVITY_TIMEOUT)
        }

        // İlk timer'ı başlat
        resetTimer()

        // Event listener'ları ekle
        events.forEach((event) => {
          window.addEventListener(event, resetTimer, { passive: true })
        })

        // Cleanup fonksiyonu
        return () => {
          isMounted = false
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          events.forEach((event) => {
            window.removeEventListener(event, resetTimer)
          })
        }
      } catch (error) {
        console.error('Kullanıcı kontrolü hatası:', error)
      }
    }

    checkUserAndSetupTimer()

    // Component unmount olduğunda timer'ı temizle
    return () => {
      isMounted = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [router])

  // Bu provider sadece logic içerir, UI render etmez
  return null
}

