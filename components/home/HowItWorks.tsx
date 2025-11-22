'use client'

import { Search, MessageCircle, Star } from 'lucide-react'

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Arka plan dekoratif daireler (Blur efekti) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Hizmet Almak Hiç Bu Kadar Kolay Olmamıştı.
          </h2>
          <p className="text-lg text-slate-600">
            Antalya Ustası ile aradığın hizmete ulaşmak sadece 3 adım.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Bağlantı Çizgisi (Sadece Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-indigo-200 -z-10"></div>

          {/* Adım 1: İhtiyacını Seç */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              {/* İkon */}
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <Search className="w-10 h-10 text-indigo-600" strokeWidth={2} />
              </div>

              {/* Başlık ve Açıklama */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">İhtiyacını Seç</h3>
              <p className="text-slate-600 leading-relaxed">
                Hangi hizmete ihtiyacın var? Elektrik, tesisat, boya, mobilya... Binlerce usta arasından seç.
              </p>

              {/* Adım Numarası */}
              <div className="mt-6 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
            </div>
          </div>

          {/* Adım 2: Teklif Al & Konuş */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              {/* İkon */}
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <MessageCircle className="w-10 h-10 text-indigo-600" strokeWidth={2} />
              </div>

              {/* Başlık ve Açıklama */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">Teklif Al & Konuş</h3>
              <p className="text-slate-600 leading-relaxed">
                Ustalar sana özel teklifler gönderir. Mesajlaş, sorularını sor, anlaşma yap.
              </p>

              {/* Adım Numarası */}
              <div className="mt-6 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
            </div>
          </div>

          {/* Adım 3: İşi Bitir & Puanla */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
            <div className="flex flex-col items-center text-center">
              {/* İkon */}
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                <Star className="w-10 h-10 text-indigo-600" strokeWidth={2} />
              </div>

              {/* Başlık ve Açıklama */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">İşi Bitir & Puanla</h3>
              <p className="text-slate-600 leading-relaxed">
                İş tamamlandığında ustanı değerlendir. Yorumların diğer müşterilere yardımcı olur.
              </p>

              {/* Adım Numarası */}
              <div className="mt-6 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

