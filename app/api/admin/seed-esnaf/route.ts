import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// TypeScript hatasını önlemek için interface tanımı
interface Esnaf {
  name: string
  surname: string
  email: string
  service: string
  district: string
}

// Esnaf Listesi (Lara -> Muratpaşa DÜZELTİLDİ)
const ESNAF_LISTESI: Esnaf[] = [
  // 1. Elektrikçiler (DB: Elektrikçi)
  { name: "Mustafa", surname: "Yılmaz", email: "mustafa.elektrik@elektrikci.demo", service: "Elektrikçi", district: "Muratpaşa" },
  { name: "Kemal", surname: "Öztürk", email: "kemal.elektrik@elektrikci.demo", service: "Elektrikçi", district: "Kepez" },
  
  // 2. Tesisatçılar (DB: Tesisatçı - 'Su' yok)
  { name: "İbrahim", surname: "Demir", email: "ibrahim.tesisat@tesisatci.demo", service: "Tesisatçı", district: "Konyaaltı" },
  { name: "Hasan", surname: "Çelik", email: "hasan.tesisat@tesisatci.demo", service: "Tesisatçı", district: "Muratpaşa" },
  
  // 3. Marangozlar (DB: Marangoz)
  { name: "Ali", surname: "Tahta", email: "ali.marangoz@marangoz.demo", service: "Marangoz", district: "Kepez" },
  { name: "Veli", surname: "Yontar", email: "veli.marangoz@marangoz.demo", service: "Marangoz", district: "Alanya" },
  
  // 4. Boyacılar (DB: Boyacı - 'Badana' yok)
  { name: "Ayşe", surname: "Kaya", email: "ayse.boya@boyaci.demo", service: "Boyacı", district: "Konyaaltı" },
  // BURASI ÇOK ÖNEMLİ: Lara Veritabanında olmadığı için Muratpaşa yaptık
  { name: "Fatma", surname: "Renk", email: "fatma.boya@boyaci.demo", service: "Boyacı", district: "Muratpaşa" },
  
  // 5. Duvar Ustaları (DB: Duvar Ustası)
  { name: "Ahmet", surname: "Usta", email: "ahmet.duvar@duvar.demo", service: "Duvar Ustası", district: "Muratpaşa" },
  { name: "Serkan", surname: "Tuğla", email: "serkan.duvar@duvar.demo", service: "Duvar Ustası", district: "Manavgat" },
]

export async function GET() {
  try {
    // Supabase Key Kontrolü (Hata Ayıklama Modu)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "ANAHTAR EKSİK" }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    let basarili_sayisi = 0
    const hatalar: Array<{ email: string; hata: string }> = []
    const BATCH_SIZE = 5

    for (let i = 0; i < ESNAF_LISTESI.length; i += BATCH_SIZE) {
      const batch = ESNAF_LISTESI.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (esnaf) => {
          try {
            // 1. Kullanıcı Oluştur
            const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email: esnaf.email,
              password: '123456',
              email_confirm: true,
              user_metadata: { first_name: esnaf.name, last_name: esnaf.surname },
            })

            if (authError || !authUser?.user?.id) {
              hatalar.push({
                email: esnaf.email,
                hata: `Kullanıcı oluşturulamadı: ${authError?.message || 'User ID alınamadı'}`,
              })
              return
            }

            const userId = authUser.user.id

            // 2. Profil Güncelle
            const { error: profileError } = await supabaseAdmin
              .from('profiles')
              .update({
                first_name: esnaf.name,
                last_name: esnaf.surname,
                is_provider: true,
                is_verified: true,
              })
              .eq('id', userId)

            if (profileError) {
              hatalar.push({
                email: esnaf.email,
                hata: `Profil güncellenemedi: ${profileError.message}`,
              })
              return
            }

            // 3. Hizmet Bağla
            const { data: serviceData, error: serviceError } = await supabaseAdmin
              .from('services')
              .select('id')
              .eq('name', esnaf.service)
              .single()

            if (serviceError || !serviceData) {
              hatalar.push({
                email: esnaf.email,
                hata: `Hizmet bulunamadı: ${esnaf.service} - ${serviceError?.message || 'Service data yok'}`,
              })
              return
            }

            const { error: serviceInsertError } = await supabaseAdmin
              .from('provider_services')
              .insert({
                provider_id: userId,
                service_id: serviceData.id,
              })

            if (serviceInsertError) {
              hatalar.push({
                email: esnaf.email,
                hata: `Hizmet bağlanamadı: ${serviceInsertError.message}`,
              })
              return
            }

            // 4. İlçe Bağla
            const { data: districtData, error: districtError } = await supabaseAdmin
              .from('antalya_districts')
              .select('id')
              .eq('name', esnaf.district)
              .single()

            if (districtError || !districtData) {
              hatalar.push({
                email: esnaf.email,
                hata: `İlçe bulunamadı: ${esnaf.district} - ${districtError?.message || 'District data yok'}`,
              })
              return
            }

            const { error: locationInsertError } = await supabaseAdmin
              .from('provider_locations')
              .insert({
                provider_id: userId,
                district_id: districtData.id,
              })

            if (locationInsertError) {
              hatalar.push({
                email: esnaf.email,
                hata: `İlçe bağlanamadı: ${locationInsertError.message}`,
              })
              return
            }

            // Başarılı!
            basarili_sayisi++
          } catch (e: any) {
            hatalar.push({
              email: esnaf.email,
              hata: `Beklenmeyen hata: ${e?.message || String(e)}`,
            })
          }
        })
      )
    }

    return NextResponse.json({
      toplam_esnaf: ESNAF_LISTESI.length,
      basarili_sayisi: basarili_sayisi,
      hatalar: hatalar.length > 0 ? hatalar : [],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        toplam_esnaf: ESNAF_LISTESI.length,
        basarili_sayisi: 0,
        hatalar: [{ email: 'GENEL_HATA', hata: error?.message || String(error) }],
      },
      { status: 500 }
    )
  }
}
