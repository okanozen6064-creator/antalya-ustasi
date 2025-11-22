'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Supabase Admin Client (RLS'yi bypass etmek için)
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Provider'ın işi tamamlaması
 * Sadece Provider yapabilir
 */
export async function completeJob(requestId: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Giriş yapmanız gerekiyor.' }
    }

    // İş talebini çek ve kontrol et
    const { data: jobRequest, error: jobError } = await supabase
      .from('job_requests')
      .select('provider_id, status')
      .eq('id', requestId)
      .single()

    if (jobError || !jobRequest) {
      return { success: false, message: 'İş talebi bulunamadı.' }
    }

    // Sadece Provider işi tamamlayabilir
    if (jobRequest.provider_id !== user.id) {
      return { success: false, message: 'Bu işi sadece usta tamamlayabilir.' }
    }

    // İş zaten tamamlanmış mı kontrol et
    if (jobRequest.status === 'completed') {
      return { success: false, message: 'Bu iş zaten tamamlanmış.' }
    }

    // İşi tamamla
    const { error: updateError } = await supabaseAdmin
      .from('job_requests')
      .update({ status: 'completed' })
      .eq('id', requestId)

    if (updateError) {
      console.error('İş tamamlama hatası:', updateError)
      return { success: false, message: `İş tamamlanırken hata: ${updateError.message}` }
    }

    revalidatePath(`/panel/mesajlar/${requestId}`)
    return { success: true, message: 'İş başarıyla tamamlandı!' }
  } catch (error: any) {
    console.error('Beklenmeyen hata:', error)
    return { success: false, message: error.message || 'Bir hata oluştu.' }
  }
}

/**
 * Client'ın ustayı değerlendirmesi
 * Sadece Client yapabilir
 */
export async function submitReview(
  requestId: string,
  providerId: string,
  rating: number,
  comment: string
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Giriş yapmanız gerekiyor.' }
    }

    // İş talebini çek ve kontrol et
    const { data: jobRequest, error: jobError } = await supabase
      .from('job_requests')
      .select('user_id, status')
      .eq('id', requestId)
      .single()

    if (jobError || !jobRequest) {
      return { success: false, message: 'İş talebi bulunamadı.' }
    }

    // Sadece Client değerlendirme yapabilir
    if (jobRequest.user_id !== user.id) {
      return { success: false, message: 'Bu işi sadece müşteri değerlendirebilir.' }
    }

    // İş tamamlanmış mı kontrol et
    if (jobRequest.status !== 'completed') {
      return { success: false, message: 'İş tamamlanmadan değerlendirme yapılamaz.' }
    }

    // Daha önce bu provider için değerlendirme yapılmış mı kontrol et
    // (Aynı iş talebi için birden fazla değerlendirme yapılamaz)
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('provider_id', providerId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingReview) {
      return { success: false, message: 'Bu iş için zaten değerlendirme yaptınız.' }
    }

    // Validasyon
    if (rating < 1 || rating > 5) {
      return { success: false, message: 'Puan 1 ile 5 arasında olmalıdır.' }
    }

    if (!comment.trim()) {
      return { success: false, message: 'Lütfen yorumunuzu yazınız.' }
    }

    // Review'ı ekle (job_request_id alanı varsa ekle, yoksa sadece provider_id ve user_id ile)
    const reviewData: any = {
      provider_id: providerId,
      user_id: user.id,
      rating: rating,
      comment: comment.trim(),
    }
    
    // Eğer reviews tablosunda job_request_id kolonu varsa ekle
    // (Supabase'de bu kolon olmayabilir, o yüzden opsiyonel)
    // reviewData.job_request_id = requestId

    const { error: insertError } = await supabaseAdmin.from('reviews').insert(reviewData)

    if (insertError) {
      console.error('Değerlendirme ekleme hatası:', insertError)
      return { success: false, message: `Değerlendirme kaydedilirken hata: ${insertError.message}` }
    }

    // Provider'ın ortalama puanını ve yorum sayısını güncelle
    const { data: allReviews } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('provider_id', providerId)

    if (allReviews && allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
      const averageRating = totalRating / allReviews.length
      const reviewCount = allReviews.length

      await supabaseAdmin
        .from('profiles')
        .update({
          average_rating: averageRating,
          review_count: reviewCount,
        })
        .eq('id', providerId)
    }

    revalidatePath(`/panel/mesajlar/${requestId}`)
    revalidatePath(`/profil/${providerId}`)
    return { success: true, message: 'Değerlendirmeniz başarıyla kaydedildi!' }
  } catch (error: any) {
    console.error('Beklenmeyen hata:', error)
    return { success: false, message: error.message || 'Bir hata oluştu.' }
  }
}

