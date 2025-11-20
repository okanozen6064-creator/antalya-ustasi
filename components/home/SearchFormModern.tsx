'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelectDistrict } from '@/components/ui/multi-select-district'
import { Search } from 'lucide-react'

interface Service {
  id: number
  name: string
  slug: string
}

interface District {
  id: number
  name: string
}

interface SearchFormModernProps {
  services: Service[]
  districts: District[]
  filterAction: (formData: FormData) => Promise<void>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-xl shadow-indigo-300 flex-shrink-0 transition-colors"
    >
      <Search className="mr-2 h-5 w-5" /> {pending ? 'ARANIYOR...' : 'USTA BUL'}
    </Button>
  )
}

export function SearchFormModern({ services, districts, filterAction }: SearchFormModernProps) {
  const [selectedService, setSelectedService] = useState('')

  return (
    <form
      action={filterAction}
      className="flex flex-col md:flex-row gap-4 p-5 md:p-6 bg-white rounded-xl shadow-2xl shadow-indigo-100 border border-gray-200 mx-auto"
    >
      {/* Hizmet Seçimi */}
      <div className="flex-1">
        <Select value={selectedService} onValueChange={setSelectedService} required>
          <SelectTrigger className="h-14 w-full text-base border-2 border-gray-300 focus:border-indigo-600 ring-offset-0 ring-0">
            <SelectValue placeholder="Bir hizmet seçin..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0" disabled>
              — Bir Hizmet Seçin —
            </SelectItem>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.slug}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Hidden input for form submission */}
        <input type="hidden" name="service" value={selectedService} />
      </div>

      {/* İlçe Seçimi (Multi-Select) */}
      <div className="flex-1 relative">
        <MultiSelectDistrict districts={districts} name="district" />
      </div>

      {/* Arama Butonu */}
      <SubmitButton />
    </form>
  )
}

