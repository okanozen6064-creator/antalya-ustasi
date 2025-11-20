import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="bg-blue-600 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Sistem Nasıl İşliyor?
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
            Antalya Ustası, hizmet arayanlarla profesyonelleri en hızlı ve
            güvenli şekilde buluşturan yeni nesil bir platformdur.
          </p>
        </div>
      </section>

      {/* 2. MÜŞTERİLER İÇİN ADIMLAR */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              Müşteriler İçin
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              Hizmet Almak İstiyorum
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Adım 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-2xl font-bold">
                🔍
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Aradığını Bul
              </h3>
              <p className="text-gray-600">
                Arama kutusuna ihtiyacın olan hizmeti (Boyacı, Nakliyat vb.) ve
                ilçeni yaz, en iyi ustaları listele.
              </p>
            </div>

            {/* Adım 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-2xl font-bold">
                ⚖️
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Profilleri İncele
              </h3>
              <p className="text-gray-600">
                Ustaların geçmiş işlerini, müşteri yorumlarını, puanlarını ve
                uzmanlık alanlarını detaylıca incele.
              </p>
            </div>

            {/* Adım 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-2xl font-bold">
                📞
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                İletişime Geç
              </h3>
              <p className="text-gray-600">
                İster hemen ara, ister teklif iste. Ustalarla doğrudan görüş ve
                işini güvenle hallet.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Hemen Usta Ara
            </Link>
          </div>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* 3. ESNAFLAR İÇİN ADIMLAR */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              Esnaflar İçin
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">
              Hizmet Vermek İstiyorum
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Adım 1 */}
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                📝
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Ücretsiz Üye Ol
              </h3>
              <p className="text-gray-600">
                Sadece 1 dakikada kaydını oluştur. Adını, soyadını ve
                iletişim bilgilerini gir.
              </p>
            </div>

            {/* Adım 2 */}
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                🛠️
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Profilini Düzenle
              </h3>
              <p className="text-gray-600">
                Hangi işleri yaptığını, hangi ilçelere gittiğini seç. Vitrindeki
                yerini hazırla.
              </p>
            </div>

            {/* Adım 3 */}
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                İşleri Kap
              </h3>
              <p className="text-gray-600">
                Müşteriler seni bulsun, telefonun çalsın. İşlerini büyütmeye
                başla.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/kayit-ol"
              className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors"
            >
              Esnaf Olarak Katıl
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SIKÇA SORULAN SORULAR */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Sıkça Sorulan Sorular
          </h2>

          <div className="grid gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <h4 className="font-bold text-lg mb-2 text-gray-900">
                Bu platform ücretli mi?
              </h4>
              <p className="text-gray-600">
                Müşteriler için tamamen ücretsizdir. Esnaflar için ise şu an
                ücretsiz üyelik fırsatı devam etmektedir.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <h4 className="font-bold text-lg mb-2 text-gray-900">
                Ustalara nasıl güvenebilirim?
              </h4>
              <p className="text-gray-600">
                Tüm ustalarımızın telefon ve kimlik doğrulaması yapılır. Ayrıca
                diğer kullanıcıların gerçek yorumlarını inceleyebilirsiniz.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <h4 className="font-bold text-lg mb-2 text-gray-900">
                Sadece Antalya için mi?
              </h4>
              <p className="text-gray-600">
                Evet, şu an sadece Antalya'nın 19 ilçesinde, yerel ve hızlı
                hizmet vermeye odaklandık.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <h4 className="font-bold text-lg mb-2 text-gray-900">
                Nasıl hızlı iletişim kurabilirim?
              </h4>
              <p className="text-gray-600">
                Her esnaf kartında "Hemen Ara" butonu bulunur. Tek tıkla
                telefon numarasını görüp direkt arayabilirsiniz.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <h4 className="font-bold text-lg mb-2 text-gray-900">
                Esnaf olarak ne zaman iş almaya başlarım?
              </h4>
              <p className="text-gray-600">
                Profilinizi tamamladıktan ve onaylandıktan sonra, müşteriler
                sizi bulabilir ve iş talepleri gönderebilir. Genellikle 24-48
                saat içinde aktif olursunuz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
