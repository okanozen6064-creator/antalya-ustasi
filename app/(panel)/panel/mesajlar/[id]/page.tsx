'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Link from 'next/link'

interface Message {
  id: string
  message_text: string
  sender_id: string
  created_at: string
  sender_profile?: {
    first_name: string | null
    last_name: string | null
  } | null
}

interface JobRequest {
  id: string
  request_details: string | null
  status: string
  user_id: string
  provider_id: string
  client_profile: {
    first_name: string | null
    last_name: string | null
  } | null
  provider_profile: {
    first_name: string | null
    last_name: string | null
  } | null
}

export default function ChatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = params.id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [jobRequest, setJobRequest] = useState<JobRequest | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll'u en alta indir
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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

      // İş talebini çek
      const { data: jobData, error: jobError } = await supabase
        .from('job_requests')
        .select(
          `
          id,
          request_details,
          status,
          user_id,
          provider_id,
          client_profile:profiles!user_id(first_name, last_name),
          provider_profile:profiles!provider_id(first_name, last_name)
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

      setJobRequest({
        ...jobData,
        client_profile: jobData.client_profile || null,
        provider_profile: jobData.provider_profile || null,
      })

      // Mesajları çek
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(
          `
          id,
          message_text,
          sender_id,
          created_at,
          sender_profile:profiles!sender_id(first_name, last_name)
        `
        )
        .eq('job_request_id', requestId)
        .order('created_at', { ascending: true })

      if (messagesError) {
        console.warn('Mesajlar çekilemedi:', messagesError)
        setMessages([])
      } else {
        setMessages(
          (messagesData || []).map((msg: any) => ({
            ...msg,
            sender_profile: msg.sender_profile || null,
          }))
        )
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

    // Realtime aboneliği
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
        (payload) => {
          // Yeni mesaj geldiğinde listeyi güncelle
          fetchMessages()
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

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

      // Başarılı - mesajı temizle ve listeyi yenile
      setMessageText('')
      fetchMessages()
    } catch (err: any) {
      console.error('Beklenmeyen hata:', err)
      setError(err.message || 'Mesaj gönderilirken bir hata oluştu.')
    } finally {
      setSending(false)
    }
  }

  const handleCompleteJob = async () => {
    if (!requestId || !currentUserId) return

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('job_requests')
        .update({ status: 'completed' })
        .eq('id', requestId)

      if (error) {
        console.error('Durum güncelleme hatası:', error)
        setError('Durum güncellenemedi.')
        return
      }

      // Başarılı - sayfayı yenile
      fetchMessages()
    } catch (err: any) {
      console.error('Hata:', err)
      setError(err.message || 'Bir hata oluştu.')
    }
  }

  const getOtherPartyName = () => {
    if (!jobRequest || !currentUserId) return 'Kullanıcı'

    if (currentUserId === jobRequest.user_id) {
      // Ben müşteriyim, karşı taraf usta
      const name = `${jobRequest.provider_profile?.first_name || ''} ${jobRequest.provider_profile?.last_name || ''}`.trim()
      return name || 'Usta'
    } else {
      // Ben ustayım, karşı taraf müşteri
      const name = `${jobRequest.client_profile?.first_name || ''} ${jobRequest.client_profile?.last_name || ''}`.trim()
      return name || 'Müşteri'
    }
  }

  const getSenderName = (message: Message) => {
    if (message.sender_profile) {
      const name = `${message.sender_profile.first_name || ''} ${message.sender_profile.last_name || ''}`.trim()
      return name || 'Kullanıcı'
    }
    return 'Kullanıcı'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-500">Bekliyor</Badge>
      case 'accepted':
        return <Badge className="bg-blue-500">Konuşuluyor</Badge>
      case 'completed':
        return <Badge className="bg-green-500">Anlaşıldı</Badge>
      case 'rejected':
        return <Badge variant="destructive">Reddedildi</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/panel/mesajlar">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <CardTitle>{getOtherPartyName()}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {jobRequest?.request_details ? (
                    <span className="line-clamp-1">{jobRequest.request_details}</span>
                  ) : (
                    'İş Detayı'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {jobRequest && getStatusBadge(jobRequest.status)}
              {jobRequest?.status !== 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCompleteJob}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  İşi Tamamla
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mesaj Alanı */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <p className="text-gray-500">Henüz mesaj gönderilmemiş</p>
                <p className="text-sm text-gray-400 mt-2">İlk mesajı siz gönderin!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isMyMessage = message.sender_id === currentUserId
                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col gap-1 ${
                        isMyMessage ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          isMyMessage
                            ? 'bg-indigo-600 text-white rounded-br-sm'
                            : 'bg-gray-200 text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
                        <span>{format(new Date(message.created_at), 'HH:mm', { locale: tr })}</span>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>

        {/* Mesaj Input */}
        <div className="border-t p-4">
          {error && (
            <p className="text-sm text-red-600 mb-2">{error}</p>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Mesajınızı yazın..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={sending || !messageText.trim()} className="gap-2">
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Gönder
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

