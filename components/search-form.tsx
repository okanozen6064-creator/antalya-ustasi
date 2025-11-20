'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Service {
  id: string
  name: string
  slug: string
}

interface District {
  id: number
  name: string
  slug: string
}

interface SearchFormProps {
  services: Service[]
  districts: District[]
}

export function SearchForm({ services, districts }: SearchFormProps) {
  const [serviceSlug, setServiceSlug] = useState('')
  const [selectedIlce, setSelectedIlce] = useState('')
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validasyon
    if (!serviceSlug || !selectedIlce) {
      alert('Lütfen hizmet ve ilçe seçin.')
      return
    }

    // Yönlendir
    router.push(`/hizmet/${serviceSlug}?ilce=${selectedIlce}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Hizmet ve İlçe - Yan Yana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* Service Select */}
          <div>
            <label htmlFor="service" className="sr-only">
              Hizmet Türü
            </label>
            <Select value={serviceSlug} onValueChange={setServiceSlug}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Bir hizmet seçin..." />
              </SelectTrigger>
              <SelectContent className="z-50">
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.slug}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* İlçe Select */}
          <div>
            <label htmlFor="ilce" className="sr-only">
              İlçe
            </label>
            <Select value={selectedIlce} onValueChange={setSelectedIlce}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Bir ilçe seçiniz..." />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.slug}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* USTA BUL Button - En Sağda */}
        <Button
          type="submit"
          className="w-full md:w-auto h-12 px-8 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Search size={20} />
          USTA BUL
        </Button>
      </div>
    </form>
  )
}
