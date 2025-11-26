'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleProviderStatus(userId: string, status: boolean) {
  try {
    const supabase = await createClient()

    // GÜVENLİK: İşlemi yapan kişinin admin olup olmadığını kontrol et
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

    // is_verified durumunu güncelle
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_verified: status })
      .eq('id', userId)

    if (updateError) {
      console.error('Durum güncelleme hatası:', updateError)
      return { success: false, error: `Durum güncellenemedi: ${updateError.message}` }
    }

    // Sayfayı yenile
    revalidatePath('/admin/users')

    return { success: true, message: 'Kullanıcı durumu başarıyla güncellendi.' }
  } catch (error: any) {
    console.error('Beklenmeyen hata:', error)
    return { success: false, error: error.message || 'Bir hata oluştu.' }
  }
}


