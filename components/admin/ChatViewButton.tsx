'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { ChatViewModal } from './ChatViewModal'

interface ChatViewButtonProps {
  jobRequestId: string
  clientName: string
  providerName: string
}

export function ChatViewButton({
  jobRequestId,
  clientName,
  providerName,
}: ChatViewButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1"
      >
        <MessageSquare className="h-4 w-4" />
        Sohbeti Oku
      </Button>
      <ChatViewModal
        open={open}
        onOpenChange={setOpen}
        jobRequestId={jobRequestId}
        clientName={clientName}
        providerName={providerName}
      />
    </>
  )
}


