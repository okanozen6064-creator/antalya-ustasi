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
            value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
