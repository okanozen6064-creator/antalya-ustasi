'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CategoryModal } from '@/components/category-modal'

interface ServiceCategory {
  id: string
  name: string
  slug: string
  icon_name: string
}

export function ServiceCategoriesList() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [selectedServiceName, setSelectedServiceName] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('services')
          .select('id, name, slug, icon_name')
          .order('name', { ascending: true })

        if (fetchError) {
          console.error('Error fetching categories:', fetchError)
          setError(fetchError.message)
        } else {
          setCategories(data || [])
        }
      } catch (err) {
        console.error('ServiceCategoriesList error:', err)
        setError('Kategoriler yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryClick = (serviceId: string, serviceName: string) => {
    console.log('KARTA TIKLANDI:', serviceName)
    setSelectedServiceId(serviceId)
    setSelectedServiceName(serviceName)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <section className="w-full bg-white dark:bg-slate-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-600 dark:text-slate-400">
            Yükleniyor...
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full bg-white dark:bg-slate-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              Kategoriler yüklenirken bir hata oluştu: {error}
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="w-full bg-white dark:bg-slate-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-600 dark:text-yellow-400">
              Henüz kategori bulunmamaktadır.
            </p>
          </div>
        </div>
      </section>
    )
  }

  console.log('LİSTE RENDER EDİLDİ. MODAL AÇIK MI?:', isModalOpen)

  return (
    <>
      <section className="w-full bg-white dark:bg-slate-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 text-center text-balance">
            Supabase'den Gelen Kategoriler
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-12 text-balance">
            Veritabanından çekilen kategoriler
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: ServiceCategory) => (
              <div
                key={category.slug}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className="group bg-slate-50 dark:bg-slate-700 rounded-xl p-8 text-center hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-slate-200 dark:border-slate-600"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-300">
                    <span className="text-2xl">{category.icon_name || '📦'}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {category.slug}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategoryModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        serviceId={selectedServiceId}
        serviceName={selectedServiceName}
      />
    </>
  )
}
