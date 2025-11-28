'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { registerClient } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LegalAgreement from '@/components/auth/LegalAgreement'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Quote, CheckCircle2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { motion, AnimatePresence } from 'framer-motion';

// Başlangıç durumu
const initialState = {
  success: false,
  message: '',
  error: {}
};

export default function ClientRegisterPage() {
  const [state, formAction] = useFormState(registerClient, initialState);
  const [step, setStep] = useState(1);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Form verilerini geçici tutmak için state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: ''
  });

  useUnsavedChanges(isTyping);

  useEffect(() => {
    if (state.success) {
      setIsTyping(false);
      toast.success(state.message);
      setIsSuccess(true);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  useEffect(() => {
    if (state.error) {
      console.log("Form Errors:", state.error);
    }
  }, [state.error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsTyping(true);
  };

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

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Kimlik Bilgileri";
      case 2: return "Güvenlik Bilgileri";
      case 3: return "Onay ve Tamamlama";
      default: return "";
    }
  };

  // Password Strength Logic
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    if (password.length < 6) return 1; // Weak
    if (password.length < 10) return 2; // Medium
    return 3; // Strong
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getStrengthColor = () => {
    if (passwordStrength === 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-green-500";
    return "bg-gray-200";
  };

  const getStrengthWidth = () => {
    if (passwordStrength === 0) return "0%";
    if (passwordStrength === 1) return "33%";
    if (passwordStrength === 2) return "66%";
    return "100%";
  };

  // Button Active State Logic
  const isStep1Valid = formData.full_name.length > 0 && formData.email.length > 0;
  const isStep2Valid = formData.phone.length > 0 && formData.password.length > 0;
  const isFormValid = isStep1Valid && isStep2Valid && legalAccepted;

  // Animation Variants
  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row">

      {/* SOL TARA (FORM ALANI) - %40 */}
      <div className="w-full lg:w-[40%] bg-white flex flex-col justify-center px-8 py-12 lg:px-16 relative">

        {/* Logo veya Geri Dön */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="text-indigo-600 font-bold text-lg flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Ana Sayfa
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">

          {/* Progress Bar & Header - Sadece form aktifken göster */}
          {!isSuccess && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-medium text-gray-500">
                <span>Adım {step}/3</span>
                <span className="text-indigo-600">{getStepTitle()}</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="text-center lg:text-left pt-4">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {step === 1 ? "Hesabınızı Oluşturun" : step === 2 ? "Güvenliğinizi Sağlayın" : "Son Bir Adım Kaldı"}
                </h2>
                <p className="mt-2 text-gray-600">
                  Antalya'nın en güvenilir ustalarına ulaşmak için hemen katılın.
                </p>
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN */}
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center space-y-6 py-10"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                  <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <h2 className="text-3xl font-bold text-gray-900">Kayıt Başarıyla Alındı!</h2>
                  <p className="text-gray-600 max-w-xs mx-auto">
                    Hesabını aktifleştirmek için <span className="font-semibold text-gray-900">{formData.email}</span> adresine gönderdiğimiz bağlantıyı onayla.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full pt-4"
                >
                  <Link href="/">
                    <Button className="w-full h-12 text-white font-semibold text-lg rounded-xl shadow-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300 transition-all">
                      Ana Sayfaya Dön
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              /* FORM */
              <form action={formAction} className="space-y-6 overflow-hidden">
                {/* DEBUG: Form State */}
                {/* Hidden Inputs for Multi-step Persistence */}
                {step > 1 && (
                  <>
                    <input type="hidden" name="full_name" value={formData.full_name} />
                    <input type="hidden" name="email" value={formData.email} />
                  </>
                )}
                {step > 2 && (
                  <>
                    <input type="hidden" name="phone" value={formData.phone} />
                    <input type="hidden" name="password" value={formData.password} />
                  </>
                )}

                <AnimatePresence mode="wait" initial={false}>
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="space-y-5"
                    >
                      <div>
                        <Label htmlFor="full_name">Ad Soyad</Label>
                        <Input
                          id="full_name" name="full_name"
                          placeholder="Adınız Soyadınız"
                          className="mt-1 h-12 focus:border-indigo-600 transition-colors"
                          value={formData.full_name}
                          onChange={handleChange}
                        />
                        {state.error && typeof state.error === 'object' && state.error.full_name && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{state.error.full_name[0]}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                          id="email" name="email" type="email"
                          placeholder="ornek@mail.com"
                          className="mt-1 h-12 focus:border-indigo-600 transition-colors"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {state.error && typeof state.error === 'object' && state.error.email && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{state.error.email[0]}</p>
                        )}
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={!isStep1Valid}
                          className={`w-full h-12 text-white font-semibold text-lg rounded-xl shadow-lg transition-all ${isStep1Valid ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300' : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                          Devam Et <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="space-y-5"
                    >
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone" name="phone" type="tel"
                          placeholder="5xxxxxxxxx" maxLength={10}
                          className="mt-1 h-12 focus:border-indigo-600 transition-colors"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Başında 0 olmadan, 10 haneli giriniz.</p>
                        {state.error && typeof state.error === 'object' && state.error.phone && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{state.error.phone[0]}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                          id="password" name="password" type="password"
                          className="mt-1 h-12 focus:border-indigo-600 transition-colors"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        {/* Password Strength Indicator */}
                        <div className="h-1 w-full bg-gray-100 mt-2 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${getStrengthColor()}`}
                            initial={{ width: "0%" }}
                            animate={{ width: getStrengthWidth() }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        {state.error && typeof state.error === 'object' && state.error.password && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{state.error.password[0]}</p>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={prevStep} className="w-1/3 h-12 rounded-xl">
                          Geri
                        </Button>
                        <motion.div className="w-2/3" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="button"
                            onClick={nextStep}
                            disabled={!isStep2Valid}
                            className={`w-full h-12 text-white font-semibold text-lg rounded-xl shadow-lg transition-all ${isStep2Valid ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300' : 'bg-gray-300 cursor-not-allowed'}`}
                          >
                            Devam Et <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="space-y-6"
                    >
                      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                        <h3 className="font-semibold text-gray-900">Bilgilerinizi Kontrol Edin</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium text-gray-900">İsim:</span> {formData.full_name}</p>
                          <p><span className="font-medium text-gray-900">E-posta:</span> {formData.email}</p>
                          <p><span className="font-medium text-gray-900">Tel:</span> {formData.phone}</p>
                        </div>
                      </div>

                      <div>
                        <LegalAgreement onAccept={setLegalAccepted} />
                        <input type="hidden" name="legalAccepted" value={legalAccepted.toString()} />
                        {state.error && typeof state.error === 'object' && state.error.legalAccepted && (
                          <p className="text-red-500 text-xs mt-1 font-medium">{state.error.legalAccepted[0]}</p>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={prevStep} className="w-1/3 h-12 rounded-xl">
                          Geri
                        </Button>
                        <motion.div className="w-2/3" whileHover={legalAccepted ? { scale: 1.05 } : {}} whileTap={legalAccepted ? { scale: 0.95 } : {}}>
                          <Button
                            type="submit"
                            disabled={!legalAccepted}
                            className={`w-full h-12 text-white font-semibold text-lg rounded-xl shadow-lg transition-all ${legalAccepted ? 'bg-green-600 hover:bg-green-700 shadow-green-200 hover:shadow-green-300' : 'bg-gray-300 cursor-not-allowed'}`}
                          >
                            Kaydı Tamamla
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            )}
          </AnimatePresence>

          {!isSuccess && (
            <p className="text-center text-sm text-gray-500">
              Zaten hesabınız var mı?{' '}
              <Link href="/giris-yap" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Giriş Yapın
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* SAĞ TARAF (VİTRİN ALANI) - %60 */}
      <div className="hidden lg:block w-[60%] relative overflow-hidden">
        {/* Arka Plan Resmi */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')",
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* İçerik */}
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <div className="max-w-xl">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Hayatınızı Kolaylaştıracak<br />
              <span className="text-indigo-400">Profesyoneller</span>
            </h2>
            <p className="text-lg text-gray-200 mb-12 max-w-lg">
              Ev tadilatından araç bakımına, özel dersten temizliğe kadar ihtiyacınız olan tüm hizmetler tek platformda.
            </p>

            {/* Glassmorphism Testimonial Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-md transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Quote className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <p className="text-white text-lg font-medium leading-relaxed mb-4">
                    "Antalya Ustası sayesinde 1 saatte işimi hallettim. Gelen usta hem çok temiz çalıştı hem de tam zamanında geldi."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      AY
                    </div>
                    <div>
                      <p className="text-white font-semibold">Ayşe Yılmaz</p>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
