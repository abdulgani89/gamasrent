'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Calendar } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface HeroSearchFormProps {
  categories: Category[]
}

export default function HeroSearchForm({ categories }: HeroSearchFormProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (startDate) params.set('startAt', new Date(startDate).toISOString())
    if (endDate) params.set('endAt', new Date(endDate).toISOString())
    router.push(`/katalog?${params.toString()}`)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form
      onSubmit={handleSearch}
      id="hero-search-form"
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Category */}
        <div>
          <label className="block text-xs text-gray-300 font-medium mb-1.5">Kategori</label>
          <select
            id="hero-search-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
          >
            <option value="" className="text-gray-900">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug} className="text-gray-900">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs text-gray-300 font-medium mb-1.5">Tanggal Mulai</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            <input
              id="hero-search-start-date"
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                if (endDate && e.target.value >= endDate) setEndDate('')
              }}
              className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs text-gray-300 font-medium mb-1.5">Tanggal Selesai</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            <input
              id="hero-search-end-date"
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        id="hero-search-submit"
        className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm"
      >
        <Search className="w-4 h-4" />
        Cari Unit Tersedia
      </button>
    </form>
  )
}
