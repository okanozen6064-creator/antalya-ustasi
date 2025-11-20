'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CategoryModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  serviceId: string | null
  serviceName: string | null
}

interface SubCategory {
  name: string
  description: string | null
}

export function CategoryModal({
  isOpen,
  setIsOpen,
  serviceId,
  serviceName,
}: CategoryModalProps) {
  console.log('MODAL RENDER EDİLDİ. isOpen propu:', isOpen)
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !serviceId) {
      setSubCategories([])
      return
    }

    const fetchSubCategories = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('service_subcategories')
          .select('name, description')
          .eq('service_id', serviceId)
          .is('parent_id', null)

        if (fetchError) {
          console.error('Error fetching subcategories:', fetchError)
          setError(fetchError.message)
        } else {
          setSubCategories(data || [])
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Alt kategoriler yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchSubCategories()
  }, [isOpen, serviceId])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{serviceName || 'Alt Kategoriler'}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading && (
            <p className="text-center text-slate-600 dark:text-slate-400">
              Yükleniyor...
            </p>
          )}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {!loading && !error && subCategories.length === 0 && (
            <p className="text-center text-slate-600 dark:text-slate-400">
              Bu kategori için alt kategori bulunmamaktadır.
            </p>
          )}
          {!loading && !error && subCategories.length > 0 && (
            <div className="space-y-4">
              {subCategories.map((subCategory, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {subCategory.name}
                  </h3>
                  {subCategory.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {subCategory.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

