import { z } from 'zod';

// 1. Temel Kurallar (Reusable)
const phoneRegex = /^5[0-9]{9}$/; // 5 ile başlayan 10 hane
const taxNumberRegex = /^[0-9]{10,11}$/; // Sadece rakam

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
