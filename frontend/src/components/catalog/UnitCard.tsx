import Link from 'next/link'
import Image from 'next/image'
import { Car, Star, Calendar, MessageCircle } from 'lucide-react'
import { cn, formatRupiah } from '@/lib/utils'

interface UnitCardProps {
  unit: {
    id: string
    name: string
    slug: string
    description?: string | null
    dailyRate: string | number
    depositAmount?: string | number | null
    operationalStatus: string
    category: { name: string; slug: string }
    images: { imageUrl: string; altText?: string | null }[]
    isFeatured?: boolean
  }
  className?: string
  dateParams?: { startAt?: string; endAt?: string }
}

export default function UnitCard({ unit, className, dateParams }: UnitCardProps) {
  const mainImage = unit.images[0]
  const isAvailable = unit.operationalStatus === 'AVAILABLE'

  let targetUrl = `/unit/${unit.slug}`
  if (dateParams?.startAt) {
    const q = new URLSearchParams()
    q.set('startAt', dateParams.startAt)
    if (dateParams.endAt) q.set('endAt', dateParams.endAt)
    targetUrl += `?${q.toString()}`
  }

  return (
    <Link href={targetUrl} className={cn('group block', className)}>
      <div className="card-hover overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage.imageUrl}
              alt={mainImage.altText || unit.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-4xl text-gray-300">📦</span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 shadow-sm">
              {unit.category.name}
            </span>
          </div>

          {/* Featured badge */}
          {unit.isFeatured && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 bg-orange-500 rounded-lg text-xs font-semibold text-white shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3" /> Unggulan
              </span>
            </div>
          )}

          {/* Unavailable overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-gray-700">
                {unit.operationalStatus === 'MAINTENANCE' ? 'Sedang Maintenance' : 'Tidak Tersedia'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {unit.name}
          </h3>
          {unit.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
              {unit.description}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Tarif harian</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatRupiah(Number(unit.dailyRate))}
                </p>
              </div>
              {isAvailable && (
                <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Tersedia
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function UnitCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-52 bg-gray-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  )
}
