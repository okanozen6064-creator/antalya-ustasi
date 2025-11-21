import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Eğer resim optimizasyonu için remotePatterns varsa buraya eklemeyi unutma
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // "Nuclear Option": Her şeye izin ver. Hata çıkma şansı yok.
            // Tüm directive'ler eklenmiş: script-src, default-src, style-src, img-src, connect-src, font-src, frame-src, worker-src, manifest-src, media-src, object-src, base-uri, form-action, frame-ancestors
            value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob: 'unsafe-hashes'; style-src * 'unsafe-inline' data: blob:; img-src * data: blob: 'unsafe-inline'; connect-src * 'unsafe-inline' data: blob:; font-src * data: blob: 'unsafe-inline'; frame-src * data: blob:; worker-src * 'unsafe-inline' 'unsafe-eval' data: blob:; manifest-src * data: blob:; media-src * data: blob:; object-src * data: blob:; base-uri * data: blob:; form-action * data: blob:; frame-ancestors *; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
