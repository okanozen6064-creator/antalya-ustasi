import { z } from 'zod';

// 1. Temel Kurallar (Reusable)
const phoneRegex = /^5[0-9]{9}$/; // 5 ile başlayan 10 hane
const taxNumberRegex = /^[0-9]{10,11}$/; // Sadece rakam

// 2. Müşteri Kayıt Şeması
export const clientRegisterSchema = z.object({
    full_name: z.string().min(3, { message: "Ad Soyad en az 3 karakter olmalıdır." }),
    email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
    password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır." }),
    phone: z.string().regex(phoneRegex, { message: "Telefon: Başında 0 olmadan, 5 ile başlayan 10 hane giriniz (Örn: 5321234567)." }),
    // Yöntem: Boolean olmalı ve değeri 'true' olmalı (Refine ile kontrol)
    legalAccepted: z.boolean().refine(val => val === true, {
        message: "Sözleşmeyi onaylamanız şarttır."
    }),
});

// 3. Usta Kayıt Şeması (Müşteriye ek olarak)
export const providerRegisterSchema = clientRegisterSchema.extend({
    business_name: z.string().optional(),
    tax_number: z.string().regex(taxNumberRegex, { message: "Geçerli bir Vergi veya TC No giriniz." }),
    service_ids: z.array(z.string()).min(1, { message: "En az bir hizmet seçmelisiniz." }),
    district_ids: z.array(z.string()).min(1, { message: "En az bir bölge seçmelisiniz." }),
});

// 4. İş Talebi (Teklif İste) Şeması
export const jobRequestSchema = z.object({
    description: z.string().min(10, "Lütfen işi en az 10 karakterle anlatınız."),
    provider_id: z.string().uuid(),
});

// 5. Yorum (Review) Şeması
export const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(5, "Yorumunuz çok kısa."),
    request_id: z.number(),
    provider_id: z.string().uuid(),
});
