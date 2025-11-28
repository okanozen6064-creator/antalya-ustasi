'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react"; // Uyarı ikonu ekleyelim

interface LegalAgreementProps {
  onAccept: (accepted: boolean) => void;
}

export default function LegalAgreement({ onAccept }: LegalAgreementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckedInModal, setIsCheckedInModal] = useState(false);
  const [isAcceptedFinal, setIsAcceptedFinal] = useState(false);

  const handleConfirm = () => {
    if (isCheckedInModal) {
      setIsAcceptedFinal(true);
      onAccept(true);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Dışarıdaki Checkbox */}
      <Checkbox
        id="legal-trigger"
        name="terms_agreement_checkbox"
        checked={isAcceptedFinal}
        onCheckedChange={(checked) => {
          if (checked) {
            setIsOpen(true);
          } else {
            setIsAcceptedFinal(false);
            onAccept(false);
            setIsCheckedInModal(false);
          }
        }}
      />

      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor="legal-trigger"
          className="text-sm font-medium leading-none cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <span className="text-indigo-600 hover:underline font-bold">
            Beta Sürüm Kullanıcı Sözleşmesi
          </span>
          'ni ve Veri Politikası'nı okudum, kabul ediyorum.
        </Label>
      </div>

      {/* MODAL İÇERİĞİ */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              ÖNEMLİ: BETA SÜRÜM UYARISI VE SÖZLEŞME
            </DialogTitle>
            <DialogDescription>
              Siteyi kullanmaya başlamadan önce lütfen aşağıdaki şartları dikkatlice okuyunuz.
            </DialogDescription>
          </DialogHeader>

          {/* HUKUKİ METİN ALANI */}
          <div className="flex-1 overflow-y-auto border-2 border-red-100 bg-red-50/30 p-5 rounded-md text-sm text-slate-800 leading-relaxed">
            <div className="space-y-6">

              <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                <h3 className="font-bold text-red-800 mb-2">⚠️ 1. ÖZET VE KABUL (EN ÖNEMLİ KISIM)</h3>
                <p className="font-medium">
                  Şu anda <strong>"Antalya Ustası"</strong> platformunun <strong>BETA (TEST)</strong> sürümünü kullanmaktasınız.
                  Bu site, yazılım geliştirme ve kullanıcı deneyimi testleri amacıyla yayındadır.
                  Kayıt olarak, verilerinizin test süreci sonunda <strong>SİLİNEBİLECEĞİNİ</strong> kabul etmiş olursunuz.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-indigo-900 border-b pb-1 mb-2">2. VERİLERİN GEÇİCİLİĞİ VE SİLİNMESİ</h3>
                <p>
                  İşbu platformda oluşturduğunuz hesaplar, girdiğiniz kişisel bilgiler, yüklediğiniz fotoğraflar ve oluşturduğunuz iş talepleri;
                  <strong>Beta testi süresince</strong> saklanacaktır. Beta süreci tamamlandığında veya sistemde yapılacak köklü bir güncelleme sırasında,
                  <strong>TÜM KULLANICI VERİLERİ ÖNCEDEN BİLDİRİM YAPILMAKSIZIN SIFIRLANABİLİR (SİLİNEBİLİR).</strong>
                  Kullanıcı, veri kaybından dolayı herhangi bir hak veya tazminat talep edemez.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-indigo-900 border-b pb-1 mb-2">3. HİZMET GARANTİSİ YOKTUR</h3>
                <p>
                  Platform "OLDUĞU GİBİ" (AS-IS) sunulmaktadır. Site yönetimi; sistemin kesintisiz çalışacağını, hatasız olacağını veya
                  verilen hizmetin ticari beklentilerinizi karşılayacağını garanti etmez. Oluşabilecek yazılım hataları, veri sızıntıları veya
                  kesintilerden dolayı site yönetimi sorumlu tutulamaz.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-indigo-900 border-b pb-1 mb-2">4. KVKK VE KİŞİSEL VERİLERİN İŞLENMESİ</h3>
                <p>
                  Paylaştığınız Ad, Soyad, Telefon ve E-posta bilgileriniz; sadece <strong>test amacıyla</strong> ve sistemin fonksiyonlarını denemek için işlenmektedir.
                  Bu veriler, Beta süreci boyunca 3. kişilerle ticari amaçla paylaşılmayacaktır. Ancak sistemin geliştirilmesi için veritabanında tutulacaktır.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-indigo-900 border-b pb-1 mb-2">5. TİCARİ SORUMLULUK REDDİ</h3>
                <p>
                  Platform üzerindeki "Usta" ve "Müşteri" arasındaki etkileşimler test amaçlıdır.
                  Gerçekleşen veya gerçekleşmeyen iş anlaşmalarından, ödemelerden, işçilik hatalarından veya taraflar arasındaki uyuşmazlıklardan
                  <strong>Antalya Ustası yönetimi hukuken sorumlu değildir.</strong>
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Son Güncelleme: Kasım 2025 - Versiyon: 1.0 (Beta)
              </p>
            </div>
          </div>

          {/* ONAY ALANI */}
          <DialogFooter className="flex-col sm:flex-col gap-4 border-t pt-4 bg-white">
            <div
              onClick={() => setIsCheckedInModal(!isCheckedInModal)}
              className={`
                flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none
                ${isCheckedInModal ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}
              `}
            >
              <Checkbox
                id="modal-confirm"
                checked={isCheckedInModal}
                onCheckedChange={(c) => setIsCheckedInModal(c as boolean)}
                className="h-5 w-5 mt-0.5"
              />
              <div className="grid gap-1.5">
                <Label htmlFor="modal-confirm" className="cursor-pointer font-bold text-slate-900">
                  Yukarıdaki Beta Sürüm uyarılarını okudum.
                </Label>
                <p className="text-xs text-slate-600">
                  Verilerimin test süreci sonunda silinebileceğini ve platformun test aşamasında olduğunu kabul ediyorum.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Vazgeç
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!isCheckedInModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
              >
                Kabul Ediyorum ve Devam Et
              </Button>
            </div>
          </DialogFooter>

        </DialogContent>
      </Dialog>
    </div>
  );
}
