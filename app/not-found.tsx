import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* 404 İkonu veya Büyük Yazı */}
      <div className="text-center mb-8">
        <h1 className="text-9xl font-extrabold text-gray-300 mb-4">404</h1>
        <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
        </div>
      </div>

      {/* Mesaj */}
      <div className="text-center mb-8 max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Aradığınız sayfayı veya ustayı bulamadık
        </h2>
        <p className="text-gray-600 mb-2">
          Belki taşınmıştır veya yanlış bir adrese tıkladınız.
        </p>
        <p className="text-gray-500 text-sm">
          Endişelenmeyin, size yardımcı olabiliriz!
        </p>
      </div>

      {/* Aksiyon Butonu */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>Ana Sayfaya Dön</span>
      </Link>

      {/* Ekstra Yardımcı Linkler */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
        <Link
          href="/kategoriler"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Tüm Kategoriler
        </Link>
        <span className="text-gray-300">|</span>
        <Link
          href="/nasil-calisir"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Nasıl Çalışır?
        </Link>
        <span className="text-gray-300">|</span>
        <Link
          href="/kayit-ol"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Esnaf Kayıt
        </Link>
      </div>
    </div>
  )
}

