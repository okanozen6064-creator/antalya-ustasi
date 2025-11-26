import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Başarılı - ana sayfaya veya belirtilen sayfaya yönlendir
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Hata durumunda giriş sayfasına yönlendir
  return NextResponse.redirect(new URL('/giris-yap?error=auth_callback_error', request.url))
}


