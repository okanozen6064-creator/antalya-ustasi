import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Dinamik URL alır - Vercel production, preview veya localhost
 */
export function getURL() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Vercel'de tanımlayacağımız canlı URL
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Vercel'in otomatik atadığı URL
    'http://localhost:3000'

  // URL'in sonunda '/' olduğundan emin ol ve protokol ekle
  url = url.includes('http') ? url : `https://${url}`
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  return url
}
