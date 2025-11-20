import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://*.googleapis.com https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob: https://*.googleusercontent.com https://maps.gstatic.com; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://www.google.com https://maps.google.com; connect-src 'self' https: wss: https://*.supabase.co;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
