'use client'

import { useState } from 'react'
import { Search, MessageCircle, Star, UserPlus, Briefcase, TrendingUp } from 'lucide-react'

// Müşteri Adımları
const clientSteps = [
  {
    id: 1,
    title: 'İhtiyacını Seç',
    description: 'Hangi hizmete ihtiyacın var? Elektrik, tesisat, boya... Binlerce usta arasından seç.',
    icon: Search,
  },
  {
    id: 2,
    title: 'Teklif Al & Konuş',
    description: 'Ustalar sana özel teklifler gönderir. Mesajlaş, sorularını sor, anlaşma yap.',
    icon: MessageCircle,
  },
  {
    id: 3,
    title: 'İşi Bitir & Puanla',
    description: 'İş tamamlandığında ustanı değerlendir. Yorumların diğer müşterilere yardımcı olur.',
    icon: Star,
  },
]

// Usta Adımları
const providerSteps = [
  {
    id: 1,
    title: 'Ücretsiz Üye Ol',
    description: 'Profilini oluştur, uzmanlık alanlarını ve hizmet verdiğin bölgeleri belirle.',
    icon: UserPlus,
  },
  {
    id: 2,
    title: 'İş Fırsatlarını Gör',
    description: 'Sana uygun gelen iş taleplerini anında görüntüle ve müşteriye teklifini ilet.',
    icon: Briefcase,
  },
  {
    id: 3,
    title: 'Kazanmaya Başla',
    description: 'İşi tamamla, ödemeni al ve müşteri yorumlarıyla yıldızını parlat.',
    icon: TrendingUp,
  },
]

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client')

  // Aktif veriyi seç
  const steps = activeTab === 'client' ? clientSteps : providerSteps

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Arka plan dekoratif daireler (Blur efekti) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-slate-600">
            Antalya Ustası ile aradığın hizmete ulaşmak sadece 3 adım.
          </p>
        </div>

        {/* TAB SWITCHER (Kapsül) */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-full inline-flex shadow-sm">
            <button
              onClick={() => setActiveTab('client')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'client'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Hizmet Almak İstiyorum
            </button>
            <button
              onClick={() => setActiveTab('provider')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === 'provider'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Hizmet Vermek İstiyorum
            </button>
          </div>
        </div>

        {/* KARTLAR GRID */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Bağlantı Çizgisi (Sadece Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-indigo-200 -z-10"></div>

          {steps.map((step, idx) => {
            const IconComponent = step.icon
            return (
              <div
                key={step.id}
                className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
              >
                <div className="flex flex-col items-center text-center">
                  {/* İkon */}
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                    <IconComponent className="w-10 h-10 text-indigo-600" strokeWidth={2} />
                  </div>

                  {/* Başlık ve Açıklama */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>

                  {/* Adım Numarası */}
                  <div className="mt-6 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
