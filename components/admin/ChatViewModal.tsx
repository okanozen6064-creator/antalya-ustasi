'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { Loader2, MessageSquare } from 'lucide-react'

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

interface ChatViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobRequestId: string
  clientName: string
  providerName: string
}

export function ChatViewModal({
  open,
  onOpenChange,
  jobRequestId,
  clientName,
  providerName,
}: ChatViewModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !jobRequestId) return

    const fetchMessages = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // Mevcut kullanıcıyı al (admin)
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setCurrentUserId(user?.id || null)

        // Mesajları çek - messages tablosu varsa
        // Eğer tablo adı farklıysa (job_messages, conversations, vb.) burayı güncelle
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
          .eq('job_request_id', jobRequestId)
          .order('created_at', { ascending: true })

        if (messagesError) {
          // Eğer tablo yoksa veya hata varsa, boş liste döndür
          console.warn('Mesajlar çekilemedi:', messagesError)
          setMessages([])
          setError('Mesajlaşma geçmişi bulunamadı veya henüz mesaj gönderilmemiş.')
        } else {
          // Veriyi güvenli hale getir (Array -> Object dönüşümü)
          const safeMessages = (messagesData || []).map((msg: any) => ({
            ...msg,
            // Eğer sender_profile dizi ise ilk elemanı al, değilse kendisini al, yoksa null yap.
            sender_profile: Array.isArray(msg.sender_profile)
              ? msg.sender_profile[0]
              : msg.sender_profile || null,
          }))

          setMessages(safeMessages)
        }
      } catch (err: any) {
        console.error('Mesaj yükleme hatası:', err)
        setError('Mesajlar yüklenirken bir hata oluştu.')
        setMessages([])
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Realtime aboneliği (isteğe bağlı - admin sadece okuyor)
    const supabase = createClient()
    const channel = supabase
      .channel(`job-messages-${jobRequestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `job_request_id=eq.${jobRequestId}`,
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
  }, [open, jobRequestId])

  const getSenderName = (message: Message) => {
    if (message.sender_profile) {
      const name = `${message.sender_profile.first_name || ''} ${message.sender_profile.last_name || ''}`.trim()
      return name || 'Bilinmeyen'
    }
    return 'Bilinmeyen'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Sohbet Geçmişi
          </DialogTitle>
          <DialogDescription>
            {clientName} ↔ {providerName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="ml-2 text-sm text-gray-600">Mesajlar yükleniyor...</span>
            </div>
          ) : error && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">Henüz mesaj gönderilmemiş.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col gap-1 ${
                    message.sender_id === currentUserId ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      message.sender_id === currentUserId
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{getSenderName(message)}</span>
                    <span>•</span>
                    <span>
                      {format(new Date(message.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

