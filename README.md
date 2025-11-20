# Next.js + Tailwind CSS + shadcn/ui + Supabase Projesi

Bu proje [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) ve [Supabase](https://supabase.com) ile oluşturulmuştur.

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Supabase Yapılandırması

1. `.env.local.example` dosyasını `.env.local` olarak kopyalayın:
```bash
cp .env.local.example .env.local
```

2. `.env.local` dosyasını açın ve Supabase bilgilerinizi girin:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Bu bilgileri [Supabase Dashboard](https://app.supabase.com) > Projeniz > Settings > API bölümünden alabilirsiniz.

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
├── app/                      # Next.js App Router sayfaları
│   ├── supabase-example/    # Supabase kullanım örneği
│   └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Client-side Supabase client
│   │   ├── server.ts        # Server-side Supabase client
│   │   └── middleware.ts   # Middleware için Supabase helper
│   └── utils.ts            # shadcn/ui utilities
├── components/              # React bileşenleri
│   └── ui/                 # shadcn/ui bileşenleri
├── middleware.ts           # Next.js middleware (auth kontrolü)
└── .env.local              # Environment variables (oluşturmanız gerekiyor)
```

## 🔧 Supabase Kullanımı

### Client-Side Kullanım

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()
  
  // Veri çekme
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
}
```

### Server-Side Kullanım

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function MyPage() {
  const supabase = await createClient()
  
  // Kullanıcı bilgisi
  const { data: { user } } = await supabase.auth.getUser()
  
  // Veri çekme
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
}
```

## 🎨 shadcn/ui Bileşenleri Ekleme

Yeni bir shadcn/ui bileşeni eklemek için:

```bash
npx shadcn@latest add [component-name]
```

Örnek:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## 📚 Örnek Sayfa

Supabase entegrasyonu örneğini görmek için:
- [http://localhost:3000/supabase-example](http://localhost:3000/supabase-example)

## 🔐 Authentication

Middleware, kullanıcı oturumlarını otomatik olarak yönetir. Giriş yapmamış kullanıcılar `/login` sayfasına yönlendirilir.

Giriş sayfaları oluşturmak için:
- `/app/login/page.tsx` - Giriş sayfası
- `/app/auth/callback/route.ts` - OAuth callback handler

## 📖 Daha Fazla Bilgi

- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [shadcn/ui Dokümantasyonu](https://ui.shadcn.com)
- [Tailwind CSS Dokümantasyonu](https://tailwindcss.com/docs)
