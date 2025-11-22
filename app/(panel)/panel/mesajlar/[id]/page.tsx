'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, Send, CheckCircle2, Loader2, CheckCheck, Star } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'
import { ReviewModal } from '@/components/reviews/ReviewModal'
import { completeJob } from '@/app/actions/jobs'

interface Message {
  id: string
  message_text: string
  sender_id: string
  created_at: string
  sender_profile?: {
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
  } | null
}

interface JobRequest {
  id: string
  request_details: string | null
  status: string
  user_id: string
  provider_id: string
  client_profile: {
    id: string
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
  } | null
  provider_profile: {
    id: string
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
  } | null
}

export default function ChatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = params.id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [jobRequest, setJobRequest] = useState<JobRequest | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isProvider, setIsProvider] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll'u en alta indir (hem smooth hem instant)
  const scrollToBottom = (instant = false) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' })
    }, instant ? 0 : 100)
  }

  // Textarea otomatik büyüme
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [messageText])

  // Mesajları çek
  const fetchMessages = async () => {
    try {
      const supabase = createClient()

      // Kullanıcı bilgisini al
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/giris-yap')
        return
      }

      setCurrentUserId(user.id)

      // İş talebini çek (avatar bilgileriyle)
      const { data: jobData, error: jobError } = await supabase
        .from('job_requests')
        .select(
          `
          id,
          request_details,
          status,
          user_id,
          provider_id,
          client_profile:profiles!user_id(id, first_name, last_name, avatar_url),
          provider_profile:profiles!provider_id(id, first_name, last_name, avatar_url)
        `
        )
        .eq('id', requestId)
        .single()

      if (jobError || !jobData) {
        setError('İş talebi bulunamadı.')
        setLoading(false)
        return
      }

      // Kullanıcının bu işe erişim yetkisi var mı kontrol et
      if (jobData.user_id !== user.id && jobData.provider_id !== user.id) {
        setError('Bu sohbete erişim yetkiniz yok.')
        setLoading(false)
        return
      }

      // Kullanıcının usta olup olmadığını kontrol et
      setIsProvider(jobData.provider_id === user.id)

      // Supabase'den gelen veri bazen array, bazen object olabilir - güvenli şekilde alalım
      const safeClientProfile = Array.isArray(jobData.client_profile)
        ? jobData.client_profile[0]
        : jobData.client_profile
      const safeProviderProfile = Array.isArray(jobData.provider_profile)
        ? jobData.provider_profile[0]
        : jobData.provider_profile

      setJobRequest({
        ...jobData,
        client_profile: safeClientProfile || null,
        provider_profile: safeProviderProfile || null,
      })

      // Mesajları çek (avatar bilgileriyle)
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(
          `
          id,
          message_text,
          sender_id,
          created_at,
          sender_profile:profiles!sender_id(first_name, last_name, avatar_url)
        `
        )
        .eq('job_request_id', requestId)
        .order('created_at', { ascending: true })

      if (messagesError) {
        console.warn('Mesajlar çekilemedi:', messagesError)
        setMessages([])
      } else {
        // Supabase'den gelen sender_profile bazen array olabilir, güvenli şekilde al
        const safeMessages = (messagesData || []).map((msg: any) => ({
          ...msg,
          sender_profile: Array.isArray(msg.sender_profile)
            ? msg.sender_profile[0]
            : msg.sender_profile || null,
        }))
        setMessages(safeMessages)
        // Mesajlar yüklendikten sonra scroll yap (instant)
        scrollToBottom(true)
      }

      // Eğer iş tamamlanmışsa ve client ise, daha önce yorum yapılmış mı kontrol et
      if (jobData.status === 'completed' && jobData.user_id === user.id) {
        const { data: existingReview } = await supabase
          .from('reviews')
          .select('id')
          .eq('provider_id', jobData.provider_id)
          .eq('user_id', user.id)
          .maybeSingle()

        setHasReviewed(!!existingReview)
      }
    } catch (err: any) {
      console.error('Hata:', err)
      setError(err.message || 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!requestId) return

    fetchMessages()

    // Realtime aboneliği - Yeni mesajları dinle
    const supabase = createClient()
    const channel = supabase
      .channel(`job-messages-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `job_request_id=eq.${requestId}`,
        },
        async (payload) => {
          // Mesaj zaten listede var mı kontrol et (duplicate önleme)
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === payload.new.id)
            if (exists) return prev
            return prev // Şimdilik eski listeyi döndür, profil bilgisi çekildikten sonra ekleyeceğiz
          })

          // Yeni mesaj geldiğinde, gönderenin profil bilgilerini çek
          try {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', payload.new.sender_id)
              .single()

            const newMessage: Message = {
              id: payload.new.id,
              message_text: payload.new.message_text,
              sender_id: payload.new.sender_id,
              created_at: payload.new.created_at,
              sender_profile: senderProfile || null,
            }

            setMessages((current) => {
              // Tekrar kontrol et (race condition önleme)
              const alreadyExists = current.some((msg) => msg.id === newMessage.id)
              if (alreadyExists) return current
              return [...current, newMessage]
            })
            scrollToBottom()
          } catch (err) {
            console.error('Profil bilgisi çekilemedi:', err)
            // Profil bilgisi olmadan da mesajı ekle
            const newMessage: Message = {
              id: payload.new.id,
              message_text: payload.new.message_text,
              sender_id: payload.new.sender_id,
              created_at: payload.new.created_at,
              sender_profile: null,
            }
            setMessages((current) => {
              const alreadyExists = current.some((msg) => msg.id === newMessage.id)
              if (alreadyExists) return current
              return [...current, newMessage]
            })
            scrollToBottom()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [requestId])

  // Mesajlar güncellendiğinde scroll'u en alta indir
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!messageText.trim() || !currentUserId || !requestId) return

    setSending(true)
    setError(null)

    try {
      const supabase = createClient()

      // Mesajı kaydet
      const { error: insertError } = await supabase.from('messages').insert({
        job_request_id: requestId,
        sender_id: currentUserId,
        message_text: messageText.trim(),
      })

      if (insertError) {
        console.error('Mesaj gönderme hatası:', insertError)
        setError(`Mesaj gönderilemedi: ${insertError.message}`)
        setSending(false)
        return
      }

      // Başarılı - mesajı temizle ve input'u sıfırla
      setMessageText('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      // Realtime ile mesaj otomatik eklenecek, bu yüzden burada ek bir işlem yapmıyoruz
    } catch (err: any) {
      console.error('Beklenmeyen hata:', err)
      setError(err.message || 'Mesaj gönderilirken bir hata oluştu.')
    } finally {
      setSending(false)
    }
  }

  // Enter ile gönder (Shift+Enter ile yeni satır)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCompleteJob = async () => {
    if (!requestId || !currentUserId) return

    setError(null)

    try {
      const result = await completeJob(requestId)

      if (result.success) {
        // Başarılı - sayfayı yenile
        fetchMessages()
      } else {
        setError(result.message || 'İş tamamlanırken bir hata oluştu.')
      }
    } catch (err: any) {
      console.error('Hata:', err)
      setError(err.message || 'Bir hata oluştu.')
    }
  }

  const getOtherParty = () => {
    if (!jobRequest || !currentUserId) return null

    if (currentUserId === jobRequest.user_id) {
      // Ben müşteriyim, karşı taraf usta
      return jobRequest.provider_profile
    } else {
      // Ben ustayım, karşı taraf müşteri
      return jobRequest.client_profile
    }
  }

  const getOtherPartyName = () => {
    const otherParty = getOtherParty()
    if (!otherParty) return 'Kullanıcı'

    const name = `${otherParty.first_name || ''} ${otherParty.last_name || ''}`.trim()
    return name || 'Kullanıcı'
  }

  const getInitials = (profile: { first_name: string | null; last_name: string | null } | null) => {
    if (!profile) return 'U'
    const first = profile.first_name?.charAt(0) || ''
    const last = profile.last_name?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error && !jobRequest) {
    return (
      <div className="space-y-8">
        <Link href="/panel/mesajlar">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
        </Link>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const otherParty = getOtherParty()

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[900px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Üst Bar (Header) */}
      <div className="flex items-center justify-between p-4 border-b bg-indigo-50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/panel/mesajlar">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          {otherParty && (
            <>
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={otherParty.avatar_url || undefined} alt={getOtherPartyName()} />
                <AvatarFallback className="bg-indigo-600 text-white">
                  {getInitials(otherParty)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">{getOtherPartyName()}</h2>
                <p className="text-xs text-gray-500 truncate">
                  İş: {jobRequest?.request_details || 'İş Detayı'}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* DURUM KONTROLÜ */}
          {/* DURUM 1: Provider ise ve iş 'pending' veya 'responded' ise */}
          {isProvider && (jobRequest?.status === 'pending' || jobRequest?.status === 'responded') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompleteJob}
              className="gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 font-semibold"
            >
              ✅ İşi Tamamla
            </Button>
          )}

          {/* DURUM 2: İş 'completed' ise ve Client ise ve henüz yorum yapmamışsa */}
          {jobRequest?.status === 'completed' && !isProvider && !hasReviewed && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setReviewModalOpen(true)}
              className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md"
            >
              ⭐ Ustayı Değerlendir
            </Button>
          )}

          {/* DURUM 3: İş 'completed' ve yorum yapılmışsa */}
          {jobRequest?.status === 'completed' && (isProvider || hasReviewed) && (
            <Badge className="bg-green-500 text-white font-semibold px-3 py-1">
              🎉 İş Tamamlandı
            </Badge>
          )}
        </div>
      </div>

      {/* Mesaj Alanı (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <p className="text-gray-500">Henüz mesaj gönderilmemiş</p>
            <p className="text-sm text-gray-400 mt-2">İlk mesajı siz gönderin!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isMyMessage = message.sender_id === currentUserId
              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar (Sadece karşı tarafın mesajlarında) */}
                  {!isMyMessage && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage
                        src={message.sender_profile?.avatar_url || undefined}
                        alt={getOtherPartyName()}
                      />
                      <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                        {getInitials(message.sender_profile || null)}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Mesaj Balonu */}
                  <div className={`flex flex-col gap-1 max-w-[70%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                        isMyMessage
                          ? 'bg-indigo-600 text-white rounded-br-md'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.message_text}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs text-gray-500 ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                      <span>{format(new Date(message.created_at), 'HH:mm', { locale: tr })}</span>
                      {isMyMessage && (
                        <CheckCheck className="h-3 w-3 text-indigo-400" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Mesaj Yazma Alanı (Footer) */}
      <div className="border-t bg-white p-4">
        {error && (
          <p className="text-sm text-red-600 mb-2">{error}</p>
        )}
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın... (Enter ile gönder, Shift+Enter ile yeni satır)"
            disabled={sending}
            className="flex-1 min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            type="submit"
            disabled={sending || !messageText.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 shrink-0 h-[44px] px-4"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>

      {/* Review Modal */}
      {jobRequest && jobRequest.status === 'completed' && !isProvider && (
        <ReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          requestId={requestId}
          providerId={jobRequest.provider_id}
          providerName={getOtherPartyName()}
        />
      )}
    </div>
  )
}
