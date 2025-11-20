'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface District {
  id: number
  name: string
}

interface MultiSelectDistrictProps {
  districts: District[]
  name: string
}

export function MultiSelectDistrict({ districts, name }: MultiSelectDistrictProps) {
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([])
  const [open, setOpen] = useState(false)

  const toggleDistrict = (districtId: number) => {
    setSelectedDistricts((prev) =>
      prev.includes(districtId)
        ? prev.filter((id) => id !== districtId)
        : [...prev, districtId]
    )
  }

  const displayText =
    selectedDistricts.length === 0
      ? 'İlçe Seçin (Çoklu Seçim)'
      : selectedDistricts.length === 1
        ? `${districts.find((d) => d.id === selectedDistricts[0])?.name}`
        : `${selectedDistricts.length} İlçe Seçildi`

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-14 w-full justify-between text-base border-2 border-gray-300 focus:border-indigo-500 hover:bg-gray-50 transition-colors"
          >
            <span>{displayText}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 max-h-64 overflow-y-auto p-2" align="start">
          <div className="space-y-1">
            <Label className="px-2 font-semibold">{districts.length} İlçe</Label>
            <div className="py-1 border-b mb-1" />
          </div>
          {districts.map((district) => (
            <div
              key={district.id}
              className="relative flex items-center py-2 px-2 rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleDistrict(district.id)}
            >
              <Checkbox
                id={`district-${district.id}`}
                checked={selectedDistricts.includes(district.id)}
                onCheckedChange={() => toggleDistrict(district.id)}
                className="mr-3"
              />
              <Label
                htmlFor={`district-${district.id}`}
                className="cursor-pointer font-normal text-base w-full"
              >
                {district.name}
              </Label>
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden inputs for form submission */}
      {selectedDistricts.map((districtId) => (
        <input
          key={districtId}
          type="hidden"
          name={name}
          value={districtId}
        />
      ))}
    </div>
  )
}

