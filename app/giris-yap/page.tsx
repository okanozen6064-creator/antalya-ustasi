'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('Giriş başarısız: ' + error.message)
      setLoading(false)
    } else {
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...')
      router.push('/panel')
      router.refresh()
    }
  }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      {/* SOL: FORM */}
      <div className="flex items-center justify-center py-12 px-4 bg-white">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tekrar Hoş Geldiniz</h1>
            <p className="mt-2 text-slate-500">Hesabınıza giriş yapın ve işlemlere devam edin.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" placeholder="ornek@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">Şifremi Unuttum?</Link>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
            </div>

            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-base" disabled={loading}>
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} <LogIn className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600">
            Hesabınız yok mu? <Link href="/register/client" className="text-indigo-600 font-semibold hover:underline">Kayıt Olun</Link>
          </p>
        </div>
      </div>

      {/* SAĞ: GÖRSEL */}
      <div className="hidden lg:block relative bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631603090989-93f9ef6f9dbe?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 flex h-full items-end p-10">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">İşiniz Yarım Kalmasın.</h2>
            <p className="text-indigo-200">Antalya'nın en iyi ustalarıyla çalışmaya devam edin.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
