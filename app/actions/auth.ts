'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { clientRegisterSchema, providerRegisterSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export type ActionState = {
    success?: boolean
    error?: string | Record<string, string[]>
    message?: string
}

/**
 * Müşteri Kayıt İşlemi
 */
// --- MÜŞTERİ KAYDI ---
export async function registerClient(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const rawData = {
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone'),
        // Checkbox "on" gelirse true, yoksa false
        legalAccepted: formData.get('legalAccepted') === 'true',
    };

    // 🛑 VALIDASYON KONTROLÜ
    const validated = clientRegisterSchema.safeParse(rawData);

    if (!validated.success) {
        return {
            success: false,
            message: "Lütfen formdaki kırmızı alanları düzeltin.",
            error: validated.error.flatten().fieldErrors,
        };
    }

    // ✅ HER ŞEY TAMAMSA SUPABASE'E GİT
    const supabase = await createClient();

    // İsim ayrıştırma
    const nameParts = validated.data.full_name.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || ''

    const { data, error } = await supabase.auth.signUp({
        email: validated.data.email,
        password: validated.data.password,
        options: {
            data: {
                full_name: validated.data.full_name,
                first_name: firstName,
                last_name: lastName,
                phone: validated.data.phone,
                is_provider: false,
            },
        },
    });

    if (error) {
        return { success: false, message: error.message };
    }

    return { success: true, message: "Kayıt başarılı! E-postanızı kontrol edin." };
}

/**
 * Usta (Provider) Kayıt İşlemi
 */
export async function registerProvider(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        // 1. Form verilerini al
        const rawData = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone'),
            tax_number: formData.get('tax_number'),
            business_name: formData.get('business_name'),
            legalAccepted: formData.get('legalAccepted') === 'on' || formData.get('legalAccepted') === 'true' ? true : false,
            service_ids: formData.getAll('service_ids'),
            district_ids: formData.getAll('district_ids'),
        }

        // 2. Zod Validasyonu
        const validatedFields = providerRegisterSchema.safeParse(rawData)

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.flatten().fieldErrors,
            }
        }

        const {
            email,
            password,
            full_name,
            phone,
            tax_number,
            business_name,
            service_ids,
            district_ids
        } = validatedFields.data

        // 3. Supabase ile kayıt
        const supabase = await createClient()

        // İsim ayrıştırma
        const nameParts = full_name.trim().split(/\s+/)
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || ''

        // Slug oluşturma
        const slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Date.now()}`.replace(/[^a-z0-9-]/g, '-')

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    is_provider: true,
                    business_name: business_name || '',
                    tax_number,
                    slug, // Metadata'ya da ekleyelim
                },
            },
        })

        if (authError) {
            return { success: false, error: authError.message }
        }

        if (!authData.user) {
            return { success: false, error: 'Kayıt işlemi başlatılamadı.' }
        }

        const userId = authData.user.id

        // 4. Admin Client ile Ek İşlemler (Dosya Yükleme, Profil Güncelleme, Hizmet/Bölge Ekleme)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseKey) {
            console.error('Supabase Service Role Key eksik!')
            return { success: true, message: 'Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.' }
        }

        const supabaseAdmin = createAdminClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })

        // Dosya Yükleme (Varsa)
        let taxPlateUrl: string | null = null
        const taxPlateFile = formData.get('tax_plate_file') as File | null

        if (taxPlateFile && taxPlateFile.size > 0) {
            try {
                const fileExt = taxPlateFile.name.split('.').pop()
                const fileName = `${userId}/tax_plate_${Date.now()}.${fileExt}`
                const filePath = `verification_docs/${fileName}`

                const { error: uploadError } = await supabaseAdmin.storage
                    .from('verification_docs')
                    .upload(filePath, taxPlateFile, {
                        contentType: taxPlateFile.type,
                        upsert: false,
                    })

                if (!uploadError) {
                    const { data: urlData } = supabaseAdmin.storage
                        .from('verification_docs')
                        .getPublicUrl(filePath)

                    taxPlateUrl = urlData.publicUrl
                } else {
                    console.error('Dosya yükleme hatası:', uploadError)
                }
            } catch (err) {
                console.error('Dosya işleme hatası:', err)
            }
        }

        // Profil Güncelleme
        await supabaseAdmin
            .from('profiles')
            .update({
                business_name: business_name || null,
                tax_number: tax_number,
                tax_plate_url: taxPlateUrl,
                is_provider: true,
                slug,
            })
            .eq('id', userId)

        // Hizmetleri Ekle
        if (service_ids && service_ids.length > 0) {
            const serviceInserts = service_ids.map((id) => ({
                provider_id: userId,
                service_id: parseInt(id),
            }))
            await supabaseAdmin.from('provider_services').insert(serviceInserts)
        }

        // Bölgeleri Ekle
        if (district_ids && district_ids.length > 0) {
            const locationInserts = district_ids.map((id) => ({
                provider_id: userId,
                district_id: parseInt(id),
            }))
            await supabaseAdmin.from('provider_locations').insert(locationInserts)
        }

        return {
            success: true,
            message: 'Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.',
        }

    } catch (error: any) {
        console.error('Provider kayıt hatası:', error)
        return {
            success: false,
            error: 'Beklenmeyen bir hata oluştu.',
        }
    }
}
