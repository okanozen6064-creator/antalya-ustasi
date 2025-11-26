'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { registerClient } from '@/app/actions/auth'; // Senin action dosyan
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LegalAgreement } from '@/components/auth/LegalAgreement'; // Senin yaptığın bileşen
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion'; // Animasyon için
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ArrowLeft, Star, Quote } from 'lucide-react';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';

const initialState = {
  success: false,
  message: '',
  errors: {},
};

export default function ClientRegisterPage() {
  const [state, formAction] = useFormState(registerClient, initialState);
  const [step, setStep] = useState(1); // 1: Kimlik, 2: Güvenlik, 3: Onay
  const [legalAccepted, setLegalAccepted] = useState(false);
  const router = useRouter();

  // Form verilerini geçici tutmak için state (Validation için gerekli)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isTyping, setIsTyping] = useState(false);

  useUnsavedChanges(isTyping);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsTyping(true);
  };

  // Adım İlerletme Kontrolü
  const nextStep = () => {
    if (step === 1) {
      if (!formData.full_name || !formData.email) {
        toast.error("Lütfen isim ve e-posta alanlarını doldurun.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.phone || !formData.password) {
        toast.error("Lütfen telefon ve şifre alanlarını doldurun.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  // Başarı Durumu
  useEffect(() => {
    if (state.success) {
      setIsTyping(false);
      toast.success(state.message);
      router.push('/register/success');
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">

      {/* SOL TARA (FORM ALANI) */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto w-full max-w-md space-y-8">

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
              Müşteri Hesabı Oluştur
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/giris-yap" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Giriş Yapın
              </Link>
            </p>
          </div>

          {/* Progress Bar (Adım Göstergesi) */}
          <div className="relative pt-4 pb-6">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
              <motion.div
                initial={{ width: "33%" }}
                animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span className={step >= 1 ? "text-indigo-600" : ""}>Kimlik</span>
              <span className={step >= 2 ? "text-indigo-600" : ""}>Güvenlik</span>
              <span className={step >= 3 ? "text-indigo-600" : ""}>Onay</span>
            </div>
          </div>

          {/* FORM */}
          <form action={formAction} className="space-y-6">
            <AnimatePresence mode="wait">

              {/* ADIM 1: KİMLİK */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="full_name">Ad Soyad</Label>
                    <Input
                      id="full_name" name="full_name"
                      placeholder="Örn: Ahmet Yılmaz"
                      value={formData.full_name} onChange={handleChange}
                      className="mt-1"
                    />
                    {state.error && typeof state.error === 'object' && state.error.full_name && (
                      <p className="text-red-500 text-xs mt-1">{state.error.full_name[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <Input
                      id="email" name="email" type="email"
                      placeholder="ornek@mail.com"
                      value={formData.email} onChange={handleChange}
                      className="mt-1"
                    />
                    {state.error && typeof state.error === 'object' && state.error.email && (
                      <p className="text-red-500 text-xs mt-1">{state.error.email[0]}</p>
                    )}
                  </div>
                  <Button type="button" onClick={nextStep} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">
                    Devam Et <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* ADIM 2: GÜVENLİK */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="phone">Telefon Numarası</Label>
                    <Input
                      id="phone" name="phone" type="tel"
                      placeholder="5xxxxxxxxx" maxLength={10}
                      value={formData.phone} onChange={handleChange}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-400 mt-1">Başında 0 olmadan, 10 hane.</p>
                    {state.error && typeof state.error === 'object' && state.error.phone && (
                      <p className="text-red-500 text-xs mt-1">{state.error.phone[0]}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Şifre Belirle</Label>
                    <Input
                      id="password" name="password" type="password"
                      value={formData.password} onChange={handleChange}
                      className="mt-1"
                    />
                    {state.error && typeof state.error === 'object' && state.error.password && (
                      <p className="text-red-500 text-xs mt-1">{state.error.password[0]}</p>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="w-1/3">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                    </Button>
                    <Button type="button" onClick={nextStep} className="w-2/3 bg-indigo-600 hover:bg-indigo-700">
                      Devam Et <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ADIM 3: ONAY */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Bilgilerinizi Kontrol Edin</h3>
                    <p className="text-sm text-gray-600"><span className="font-medium">İsim:</span> {formData.full_name}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">E-posta:</span> {formData.email}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Tel:</span> {formData.phone}</p>
                  </div>

                  {/* Yasal Sözleşme Bileşeni */}
                  <div className="border-t pt-4">
                    <LegalAgreement onAccept={setLegalAccepted} />
                    <input type="hidden" name="legalAccepted" value={legalAccepted.toString()} />
                    {state.error && typeof state.error === 'object' && state.error.legalAccepted && (
                      <p className="text-red-500 text-xs mt-1">{state.error.legalAccepted[0]}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={prevStep} className="w-1/3">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                    </Button>
                    <Button type="submit" className="w-2/3 bg-green-600 hover:bg-green-700 text-white" disabled={!legalAccepted}>
                      Kayıt İşlemini Tamamla
                    </Button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </form>
        </div>
      </div>

      {/* SAĞ TARAF (VİTRİN / REKLAM ALANI) - Mobilde Gizli */}
      <div className="hidden lg:flex relative w-full bg-slate-900 items-center justify-center overflow-hidden">
        {/* Arka Plan Efekti */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581578731117-104f2a863180?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-slate-900/90"></div>

        <div className="relative z-10 max-w-lg px-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Antalya'nın En İyi Ustalarıyla Tanışın
          </h2>

          <p className="text-lg text-indigo-200 mb-10">
            Eviniz için gereken her şey tek bir platformda. Güvenilir, hızlı ve onaylı hizmetin adresi.
          </p>

          {/* Testimonial Kartı */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 text-left transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <Quote className="w-8 h-8 text-indigo-400 mb-4 opacity-50" />
            <p className="text-white text-lg font-medium italic mb-4">
              "Klimam bozulmuştu, 10 dakika içinde 3 farklı ustadan teklif aldım. Hem fiyatlar çok iyiydi hem de gelen usta işinin ehliydi."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">A</div>
              <div>
                <p className="text-white font-semibold">Ayşe Yılmaz</p>
                <p className="text-indigo-300 text-sm">Muratpaşa - Müşteri</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-8 text-indigo-300 text-sm font-medium">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Ücretsiz Üyelik</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Güvenli Ödeme</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 7/24 Destek</div>
          </div>
        </div>
      </div>

    </div>
  );
}
