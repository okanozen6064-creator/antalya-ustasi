'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface LegalAgreementProps {
  onAccept: (accepted: boolean) => void
}

const LEGAL_TEXT = `ANTALYA USTASI - BETA SÜRÜMÜ KULLANICI SÖZLEŞMESİ VE KVKK AYDINLATMA METNİ

1. GENEL HÜKÜMLER

1.1. Bu sözleşme, Antalya Ustası platformunu ("Platform") kullanan tüm kullanıcılar ("Kullanıcı") ile Platform sahibi arasında geçerlidir.

1.2. Platform, hizmet sağlayıcıları ("Usta") ile hizmet talep edenler ("Müşteri") arasında köprü görevi gören bir dijital platformdur.

1.3. Platform şu anda BETA sürümünde olup, hizmetler test aşamasındadır.

2. KULLANICI YÜKÜMLÜLÜKLERİ

2.1. Kullanıcı, Platform'u yalnızca yasal amaçlar için kullanacaktır.

2.2. Kullanıcı, Platform'da paylaştığı tüm bilgilerin doğru, güncel ve eksiksiz olduğunu taahhüt eder.

2.3. Kullanıcı, Platform'u kötüye kullanmayacak, spam, dolandırıcılık veya yasadışı faaliyetlerde bulunmayacaktır.

2.4. Ustalar, verdiği hizmetlerin kalitesinden ve yasal uygunluğundan sorumludur.

2.5. Müşteriler, talep ettikleri hizmetler için uygun ödeme yapmakla yükümlüdür.

3. PLATFORM SORUMLULUKLARI

3.1. Platform, kullanıcılar arasında köprü görevi görür ancak taraflar arasındaki anlaşmalardan doğrudan sorumlu değildir.

3.2. Platform, kullanıcı bilgilerinin güvenliğini sağlamak için makul önlemler alır.

3.3. Platform, BETA sürümünde olduğu için hizmetlerinde kesintiler veya hatalar olabileceğini kabul eder.

4. FİKRİ MÜLKİYET

4.1. Platform'un tüm içeriği, tasarımı ve yazılımı telif hakkı ile korunmaktadır.

4.2. Kullanıcılar, Platform'un içeriğini izinsiz kopyalayamaz, dağıtamaz veya ticari amaçla kullanamaz.

5. GİZLİLİK VE KVKK

5.1. Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, Platform, kullanıcıların kişisel verilerini işler.

5.2. Toplanan Kişisel Veriler:
   - Ad, soyad
   - E-posta adresi
   - Telefon numarası
   - Adres bilgileri (isteğe bağlı)
   - İş talebi detayları
   - Mesajlaşma içerikleri

5.3. Veri İşleme Amaçları:
   - Platform hizmetlerinin sunulması
   - Kullanıcılar arasında iletişim kurulması
   - Hizmet kalitesinin iyileştirilmesi
   - Yasal yükümlülüklerin yerine getirilmesi

5.4. Veri Paylaşımı:
   - Kişisel veriler, yalnızca hizmet sunumu için gerekli olduğunda ilgili taraflarla (Usta-Müşteri) paylaşılır.
   - Veriler, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.

5.5. Veri Güvenliği:
   - Platform, kişisel verilerin güvenliğini sağlamak için teknik ve idari önlemler alır.
   - Veriler, şifreli bağlantılar (HTTPS) üzerinden iletilir.

5.6. Kullanıcı Hakları:
   - Kişisel verilerine erişim
   - Kişisel verilerinin düzeltilmesi
   - Kişisel verilerinin silinmesi
   - Kişisel verilerinin işlenmesine itiraz etme
   - Kişisel verilerinin taşınması

5.7. Veri Saklama:
   - Kişisel veriler, yasal saklama süreleri boyunca saklanır.
   - Hesap silindiğinde, veriler yasal saklama süreleri sonunda silinir.

6. SORUMLULUK SINIRLAMALARI

6.1. Platform, kullanıcılar arasındaki anlaşmalardan, hizmet kalitesinden veya ödemelerden sorumlu değildir.

6.2. Platform, BETA sürümünde olduğu için hizmetlerinde kesintiler veya hatalar olabileceğini kabul eder.

6.3. Kullanıcılar, Platform'u kendi riskleri altında kullanır.

7. HESAP İPTALİ VE SİLME

7.1. Kullanıcılar, istedikleri zaman hesaplarını silebilir.

7.2. Platform, yasal yükümlülükler gereği bazı verileri saklamaya devam edebilir.

8. DEĞİŞİKLİKLER

8.1. Platform, bu sözleşmeyi önceden bildirimde bulunarak değiştirebilir.

8.2. Değişiklikler, Platform'da yayınlandığı tarihte yürürlüğe girer.

9. UYUŞMAZLIK ÇÖZÜMÜ

9.1. Bu sözleşmeden kaynaklanan uyuşmazlıklar, Türkiye Cumhuriyeti yasalarına tabidir.

9.2. Uyuşmazlıklar, öncelikle müzakere yoluyla çözülmeye çalışılır.

9.3. Çözülemezse, Antalya Mahkemeleri yetkilidir.

10. İLETİŞİM

10.1. Platform ile ilgili sorularınız için: info@antalyaustasi.com

10.2. KVKK başvuruları için: kvkk@antalyaustasi.com

Bu sözleşmeyi kabul ederek, yukarıdaki tüm hükümleri okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.`

export function LegalAgreement({ onAccept }: LegalAgreementProps) {
  const [open, setOpen] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false)

  const handleAccept = () => {
    if (!modalCheckboxChecked) return // Checkbox işaretli değilse buton çalışmasın

    setAccepted(true)
    onAccept(true)
    setOpen(false)
    setModalCheckboxChecked(false) // Modal kapandığında checkbox'ı sıfırla
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Modal kapandığında checkbox'ı sıfırla
      setModalCheckboxChecked(false)
    }
  }

  const toggleAccepted = () => {
    if (accepted) {
      setAccepted(false)
      onAccept(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <div className="space-y-2">
      {/* Redesigned Checkbox Card */}
      <div
        onClick={toggleAccepted}
        className={`
          flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
          ${accepted
            ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
            : 'bg-white border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
          }
        `}
      >
        <div className="pt-1">
          <Checkbox
            id="legal-agreement"
            checked={accepted}
            onCheckedChange={(checked) => {
              // This is handled by the parent div's onClick, but we keep it for accessibility
              // If clicked directly, we need to stop propagation or handle logic carefully
              // Here we just let the parent handle it to avoid double toggle
            }}
            className="h-6 w-6 border-2 border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="legal-agreement"
            className="text-sm font-medium text-gray-900 cursor-pointer leading-relaxed block pointer-events-none" // pointer-events-none to let click pass to div
          >
            Kullanıcı Sözleşmesi ve KVKK Metni'ni okudum, anladım ve onaylıyorum.
          </label>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation() // Prevent triggering the checkbox toggle
              setOpen(true)
            }}
            className="text-indigo-600 hover:text-indigo-800 underline text-sm mt-1 font-medium"
          >
            Sözleşmeyi Oku
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Kullanıcı Sözleşmesi ve KVKK Aydınlatma Metni</DialogTitle>
            <DialogDescription>
              Lütfen aşağıdaki metni sonuna kadar okuyunuz.
            </DialogDescription>
          </DialogHeader>

          <div className="h-[400px] overflow-y-auto border p-4 rounded-md">
            <div className="whitespace-pre-line text-sm leading-relaxed text-gray-800">
              {LEGAL_TEXT}
            </div>

            {/* Metnin en altına checkbox ekle */}
            <div className="mt-4 pt-4 border-t flex items-start space-x-2">
              <Checkbox
                id="modal-legal-checkbox"
                checked={modalCheckboxChecked}
                onCheckedChange={(checked) => setModalCheckboxChecked(checked === true)}
                className="mt-1"
              />
              <label
                htmlFor="modal-legal-checkbox"
                className="text-sm text-gray-700 cursor-pointer leading-relaxed flex-1"
              >
                Aydınlatma metnini ve sözleşmeyi okudum, anladım ve onaylıyorum.
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setModalCheckboxChecked(false)
              }}
            >
              Kapat
            </Button>
            <Button
              type="button"
              onClick={handleAccept}
              disabled={!modalCheckboxChecked}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Onayla ve Devam Et
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
