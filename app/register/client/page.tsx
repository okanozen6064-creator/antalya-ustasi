'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { registerClient } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LegalAgreement } from '@/components/auth/LegalAgreement';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';

// Başlangıç durumu
const initialState = {
  success: false,
  message: '',
  error: {} // Note: Changed from 'errors' to 'error' to match ActionState type in auth.ts
};

export default function ClientRegisterPage() {
  // useFormState ile Server Action'ı bağlıyoruz
  const [state, formAction] = useFormState(registerClient, initialState);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  useUnsavedChanges(isTyping);

  useEffect(() => {
    if (state.success) {
      setIsTyping(false);
      toast.success(state.message);
      router.push('/register/success');
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleInputChange = () => {
    setIsTyping(true);
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">

      {/* SOL TARAF (FORM) */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto w-full max-w-md space-y-8">

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Müşteri Hesabı Oluştur
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/giris-yap" className="font-medium text-indigo-600 hover:text-indigo-500">
                Giriş Yapın
              </Link>
            </p>
          </div>

          {/* FORM BAŞLANGICI */}
          <form action={formAction} className="space-y-5">

            {/* Ad Soyad */}
            <div>
              <Label htmlFor="full_name">Ad Soyad</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Adınız Soyadınız"
                className="mt-1"
                onChange={handleInputChange}
              />
              {/* HATA MESAJI ALANI */}
              {state.error && typeof state.error === 'object' && state.error.full_name && (
                <p className="text-red-500 text-xs mt-1 font-medium">{state.error.full_name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@mail.com"
                className="mt-1"
                onChange={handleInputChange}
              />
              {state.error && typeof state.error === 'object' && state.error.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">{state.error.email[0]}</p>
              )}
            </div>

            {/* Telefon */}
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="5xxxxxxxxx"
                maxLength={10}
                className="mt-1"
                onChange={handleInputChange}
              />
              <p className="text-[10px] text-gray-400 mt-1">Başında 0 olmadan, 10 haneli giriniz.</p>
              {state.error && typeof state.error === 'object' && state.error.phone && (
                <p className="text-red-500 text-xs mt-1 font-medium">{state.error.phone[0]}</p>
              )}
            </div>

            {/* Şifre */}
            <div>
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                name="password"
                type="password"
                className="mt-1"
                onChange={handleInputChange}
              />
              {state.error && typeof state.error === 'object' && state.error.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">{state.error.password[0]}</p>
              )}
            </div>

            {/* Sözleşme (Gizli input ile değeri gönderiyoruz) */}
            <div>
              <LegalAgreement onAccept={setLegalAccepted} />
              <input type="hidden" name="legalAccepted" value={legalAccepted.toString()} />
              {state.error && typeof state.error === 'object' && state.error.legalAccepted && (
                <p className="text-red-500 text-xs mt-1 font-medium">{state.error.legalAccepted[0]}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2">
              Kayıt Ol
            </Button>
          </form>
        </div>
      </div>

      {/* SAĞ TARAF (VİTRİN - AYNI KALSIN) */}
      <div className="hidden lg:flex relative w-full bg-slate-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581578731117-104f2a863180')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-slate-900/90"></div>
        <div className="relative z-10 max-w-lg px-10 text-center">
          <Star className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Antalya'nın En İyileri</h2>
          <p className="text-indigo-200 text-lg">Güvenilir hizmetin tek adresi.</p>
        </div>
      </div>

    </div>
  );
}
