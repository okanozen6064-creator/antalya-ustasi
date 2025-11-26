'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { providerRegisterSchema } from '@/lib/schemas'

/**
 * Admin panelinden manuel olarak Usta (Provider) oluşturma
 * SUPABASE_SERVICE_ROLE_KEY kullanarak admin yetkisiyle işlem yapar
 */
export async function createProviderManually(formData: FormData) {
  try {
    // 1. Admin Yetki Kontrolü
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Oturum açmanız gerekiyor.' }
    }

    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !adminProfile?.is_admin) {
      return { success: false, error: 'Bu işlem için admin yetkisi gereklidir.' }
    }

    // 2. Zod Validasyonu
    const validatedFields = providerRegisterSchema.safeParse({
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      password: formData.get('password'),
      phone: formData.get('phone'),
      tax_number: formData.get('tax_number'),
      business_name: formData.get('business_name'),
      legalAccepted: true,
      service_ids: formData.getAll('service_ids'),
      district_ids: formData.getAll('district_ids'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
      }
    }

    const {
      email,
      password,
      phone,
      business_name,
      tax_number,
      full_name,
      service_ids,
      district_ids,
    } = validatedFields.data

    // İsim ayrıştırma
    const nameParts = full_name.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || ''

    // 3. Admin Client Oluştur (Service Role Key ile)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, error: 'Sunucu yapılandırması eksik.' }
    }

    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // 4. Kullanıcı Oluştur (Auth)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Otomatik onaylanmış
      user_metadata: {
        full_name: full_name, // İsim veritabanına buradan gidecek!
        first_name: firstName,
        last_name: lastName,
        is_provider: true,
        is_verified: true, // Admin eklediği için direkt onaylı
        business_name: business_name || '',
        tax_number: tax_number,
      },
    })

    if (authError || !authUser?.user?.id) {
      console.error('Kullanıcı oluşturma hatası:', authError)
      return {
        success: false,
        error: `Kullanıcı oluşturulamadı: ${authError?.message || 'User ID alınamadı'}`,
      }
    }

    const userId = authUser.user.id

    // 5. Slug Oluştur (first_name + last_name'den)
    const slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Date.now()}`.replace(
      /[^a-z0-9-]/g,
      '-'
    )

    // 6. Profil Güncelle
    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        business_name: business_name || null,
        is_provider: true,
        is_verified: true, // Elle eklenen direkt onaylı
        slug,
      })
      .eq('id', userId)

    if (profileUpdateError) {
      console.error('Profil güncelleme hatası:', profileUpdateError)
      // Kullanıcıyı geri al (rollback)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return {
        success: false,
        error: `Profil güncellenemedi: ${profileUpdateError.message}`,
      }
    }

    // 7. Hizmet Ekle (provider_services)
    const servicesData = service_ids.map((id) => ({
      provider_id: userId,
      service_id: parseInt(id),
    }))

    const { error: serviceError } = await supabaseAdmin
      .from('provider_services')
      .insert(servicesData)

    if (serviceError) {
      console.error('Hizmet ekleme hatası:', serviceError)
      // Rollback: Kullanıcıyı ve profili sil
      await supabaseAdmin.from('profiles').delete().eq('id', userId)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return {
        success: false,
        error: `Hizmet eklenemedi: ${serviceError.message}`,
      }
    }

    // 8. Bölge Ekle (provider_locations)
    const locationsData = district_ids.map((id) => ({
      provider_id: userId,
      district_id: parseInt(id),
    }))

    const { error: locationError } = await supabaseAdmin
      .from('provider_locations')
      .insert(locationsData)

    if (locationError) {
      console.error('Bölge ekleme hatası:', locationError)
      // Rollback: Kullanıcıyı, profili ve hizmeti sil
      await supabaseAdmin.from('provider_services').delete().eq('provider_id', userId)
      await supabaseAdmin.from('profiles').delete().eq('id', userId)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return {
        success: false,
        error: `Bölge eklenemedi: ${locationError.message}`,
      }
    }

    // 9. Başarılı - Sayfayı yenile
    revalidatePath('/admin/users')

    return {
      success: true,
      message: 'Usta başarıyla oluşturuldu.',
      userId,
    }
  } catch (error: any) {
    console.error('Beklenmeyen hata:', error)
    return {
      success: false,
      error: error.message || 'Bir hata oluştu.',
    }
  }
}

