import { createClient } from '@/lib/supabase/server'

export default async function SupabaseExamplePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Entegrasyonu</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Durum</h2>
        {user ? (
          <div>
            <p className="text-green-600 dark:text-green-400 mb-2">
              ✓ Kullanıcı giriş yapmış
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email: {user.email}
            </p>
          </div>
        ) : (
          <p className="text-yellow-600 dark:text-yellow-400">
            ⚠ Kullanıcı giriş yapmamış
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Kullanım Örnekleri</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Client-side kullanım:</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">
{`import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data } = await supabase.from('table').select()`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Server-side kullanım:</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">
{`import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data } = await supabase.from('table').select()`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

