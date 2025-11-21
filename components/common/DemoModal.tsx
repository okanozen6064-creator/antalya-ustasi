"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export function DemoModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // localStorage'dan kontrol et
    const hasSeenModal = localStorage.getItem("beta-modal-seen")
    
    if (!hasSeenModal) {
      // Kısa bir gecikme ile modal'ı göster (sayfa yüklendikten sonra)
      const timer = setTimeout(() => {
        setOpen(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    // localStorage'a kaydet
    localStorage.setItem("beta-modal-seen", "true")
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Modal kapatıldığında localStorage'a kaydet
      localStorage.setItem("beta-modal-seen", "true")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            🚀 Antalya Ustası - Beta Yayında!
          </DialogTitle>
          <DialogDescription className="pt-4 space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              Merhaba! Platformumuz şu anda geliştirme ve test (Beta) aşamasındadır. 
              Siteyi özgürce inceleyebilir ve gezebilirsiniz. Ancak lütfen unutmayın: 
              Şu an yapılan üyelikler ve girilen veriler test amaçlıdır ve sıfırlanabilir.
            </p>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-3">
                Görüş, öneri ve hata bildirimleri için doğrudan bize ulaşın:
              </p>
              <div className="flex items-center gap-2 bg-muted rounded-lg p-3 border border-border">
                <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <a
                  href="mailto:Mustafaokanozen@hotmail.com"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors break-all"
                >
                  Mustafaokanozen@hotmail.com
                </a>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center pt-4">
          <Button onClick={handleClose} className="w-full sm:w-auto min-w-[200px]">
            Siteyi İncelemeye Başla
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

