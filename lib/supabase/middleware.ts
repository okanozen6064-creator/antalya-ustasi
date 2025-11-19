import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Supabase environment değişkenleri yoksa veya geçersizse middleware'i atla
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  // URL geçerliliğini kontrol et (placeholder değerler veya geçersiz URL'ler için)
  try {
    const url = new URL(supabaseUrl)
    if (!url.protocol.startsWith('http')) {
      return supabaseResponse
    }
  } catch {
    // Geçersiz URL formatı, middleware'i atla
    return supabaseResponse
  }

  // Placeholder değerleri kontrol et
  if (
    supabaseUrl.includes('your_supabase') ||
    supabaseUrl.includes('placeholder') ||
    supabaseKey.includes('your_supabase') ||
    supabaseKey.includes('placeholder')
  ) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Kullanıcı oturumunu kontrol et (isteğe bağlı kullanım için)
  // Oturum yenileme için getUser() çağrısı gereklidir
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Eğer kullanıcı giriş yapmamışsa, middleware'i atla
  if (!user) {
    return supabaseResponse
  }

  // Profil kontrolü: Kullanıcı giriş yapmışsa profil durumunu kontrol et
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, is_provider')
    .eq('id', user.id)
    .single()

  // Profil hatası varsa (örneğin profil kaydı yoksa) devam et
  if (profileError) {
    console.error('Profil kontrolü hatası:', profileError)
    return supabaseResponse
  }

  const currentPath = request.nextUrl.pathname

  // Senaryo 1: Profil boşsa ve kullanıcı /profil-olustur'da değilse, yönlendir
  if (!profile?.first_name && currentPath !== '/profil-olustur') {
    const redirectUrl = new URL('/profil-olustur', request.url)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    // Cookie'leri kopyala
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Senaryo 2: Profil doluysa ve kullanıcı /profil-olustur'a gitmeye çalışıyorsa, ana sayfaya yönlendir
  if (profile?.first_name && currentPath === '/profil-olustur') {
    const redirectUrl = new URL('/', request.url)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    // Cookie'leri kopyala
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Senaryo 3: Esnaf ise (is_provider === true) ve panelde değilse, panele yönlendir
  // NOT: Profil oluşturma sayfasına erişim için istisna yapıyoruz
  if (
    profile?.is_provider === true &&
    !currentPath.startsWith('/panel') &&
    currentPath !== '/profil-olustur'
  ) {
    const redirectUrl = new URL('/panel', request.url)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    // Cookie'leri kopyala
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Senaryo 4: Esnaf değilse (is_provider === false) ve panele girmeye çalışıyorsa, ana sayfaya yönlendir
  if (profile?.is_provider === false && currentPath.startsWith('/panel')) {
    const redirectUrl = new URL('/', request.url)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    // Cookie'leri kopyala
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse
}

