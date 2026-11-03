'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown, Calendar } from 'lucide-react'
import { type CatalogFilterInput } from '@/lib/validations'

interface Category {
  id: string
  name: string
  slug: string
}

interface CatalogFilterProps {
  categories: Category[]
  currentFilter: CatalogFilterInput
}

const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'price_asc', label: 'Harga Terendah' },
  { value: 'price_desc', label: 'Harga Tertinggi' },
  { value: 'name_asc', label: 'A – Z' },
  { value: 'name_desc', label: 'Z – A' },
]

export default function CatalogFilter({ categories, currentFilter }: CatalogFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentFilter.search || '')
  const [minPrice, setMinPrice] = useState(currentFilter.minPrice?.toString() || '')
  const [maxPrice, setMaxPrice] = useState(currentFilter.maxPrice?.toString() || '')
  const [startDate, setStartDate] = useState(
    currentFilter.startAt ? currentFilter.startAt.split('T')[0] : ''
  )
  const [endDate, setEndDate] = useState(
    currentFilter.endAt ? currentFilter.endAt.split('T')[0] : ''
  )
  const [isOpen, setIsOpen] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const buildUrl = useCallback((overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const current: Record<string, string> = {}

    searchParams.forEach((v, k) => { current[k] = v })
    const merged = { ...current, ...overrides }

    for (const [k, v] of Object.entries(merged)) {
      if (v !== undefined && v !== '') params.set(k, v)
    }
    params.delete('page') // Reset page on filter change
    return `/katalog?${params.toString()}`
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(buildUrl({ search: search || undefined }))
  }

  const handleCategoryChange = (slug: string) => {
    router.push(buildUrl({ category: slug || undefined }))
  }

  const handleSortChange = (sortBy: string) => {
    router.push(buildUrl({ sortBy }))
  }

  const handlePriceFilter = () => {
    router.push(buildUrl({ minPrice: minPrice || undefined, maxPrice: maxPrice || undefined }))
  }

  const handleDateFilter = () => {
    if (!startDate) {
      router.push(buildUrl({ startAt: undefined, endAt: undefined }))
      return
    }
    const s = new Date(`${startDate}T00:00:00`)
    const effectiveEnd = endDate || startDate
    const e = new Date(`${effectiveEnd}T23:59:59.999`)
    router.push(buildUrl({ startAt: s.toISOString(), endAt: e.toISOString() }))
  }

  const handleClearDates = () => {
    setStartDate('')
    setEndDate('')
    router.push(buildUrl({ startAt: undefined, endAt: undefined }))
  }

  const handleReset = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setStartDate('')
    setEndDate('')
    router.push('/katalog')
  }

  const hasActiveFilters = !!(
    currentFilter.search ||
    currentFilter.category ||
    currentFilter.minPrice ||
    currentFilter.maxPrice ||
    currentFilter.startAt ||
    currentFilter.endAt
  )

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl mb-4 text-sm font-medium text-gray-700"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filter & Urutkan
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">!</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`space-y-4 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Search */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Pencarian</h3>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="catalog-search"
              type="text"
              placeholder="Nama unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </form>
        </div>

        {/* Date Filter */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              Ketersediaan Tanggal
            </h3>
            {(startDate || currentFilter.startAt) && (
              <button
                type="button"
                onClick={handleClearDates}
                className="text-[11px] text-red-500 hover:text-red-700 font-medium"
              >
                Hapus
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] text-gray-500 font-medium mb-1">Mulai</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  if (endDate && e.target.value >= endDate) setEndDate('')
                }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 font-medium mb-1">Selesai</label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="button"
              onClick={handleDateFilter}
              disabled={!startDate}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Cek Unit Tersedia
            </button>
          </div>
        </div>

        {/* Sort */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Urutkan</h3>
          <div className="space-y-2">
            {sortOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="sort"
                  value={opt.value}
                  checked={currentFilter.sortBy === opt.value}
                  onChange={() => handleSortChange(opt.value)}
                  className="accent-orange-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategori</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value=""
                checked={!currentFilter.category}
                onChange={() => handleCategoryChange('')}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Semua Kategori</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={currentFilter.category === cat.slug}
                  onChange={() => handleCategoryChange(cat.slug)}
                  className="accent-orange-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Rentang Harga (per hari)</h3>
          <div className="space-y-2.5">
            <input
              id="filter-min-price"
              type="number"
              placeholder="Harga minimum"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              id="filter-max-price"
              type="number"
              placeholder="Harga maksimum"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={handlePriceFilter}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Reset Semua Filter
          </button>
        )}
      </div>
    </>
  )
}
