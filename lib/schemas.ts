import { z } from 'zod';

// 1. Temel Kurallar (Reusable)
const phoneRegex = /^5[0-9]{9}$/;
const taxNumberRegex = /^[0-9]{10,11}$/;

// 2. Müşteri Kayıt Şeması
export const clientRegisterSchema = z.object({
    full_name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır."),
    email: z.string().email("Geçerli bir e-posta adresi giriniz."),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
    phone: z.string().regex(phoneRegex, "Telefon numarası 5 ile başlamalı ve 10 haneli olmalıdır (Örn: 532...)"),
    legalAccepted: z.literal(true, { message: "Sözleşmeyi onaylamanız gerekmektedir." }),
});

// 3. Usta Kayıt Şeması (Müşteriye ek olarak)
export const providerRegisterSchema = clientRegisterSchema.extend({
    business_name: z.string().optional(), // Opsiyonel
    tax_number: z.string().regex(taxNumberRegex, "Vergi numarası 10 veya 11 haneli olmalıdır."),
    service_ids: z.array(z.string()).min(1, "En az bir hizmet seçmelisiniz."),
    district_ids: z.array(z.string()).min(1, "En az bir hizmet bölgesi seçmelisiniz."),
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
