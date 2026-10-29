import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { catalogFilterSchema } from '@/lib/validations'
import UnitCard, { UnitCardSkeleton } from '@/components/catalog/UnitCard'
import CatalogFilter from '@/components/catalog/CatalogFilter'
import { OperationalStatus } from '@/lib/types'
import { Prisma } from '@prisma/client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Katalog Unit',
  description: 'Temukan dan sewa unit kendaraan atau perlengkapan yang Anda butuhkan. Filter berdasarkan kategori, harga, dan ketersediaan.',
}

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function getUnits(searchParams: Record<string, string | string[] | undefined>) {
  const params: Record<string, string> = {}
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string') params[k] = v
  }

  const parsed = catalogFilterSchema.safeParse(params)
  if (!parsed.success) {
    const defaults = catalogFilterSchema.parse({})
    return { units: [], total: 0, page: 1, limit: 12, totalPages: 0, filter: defaults }
  }

  const filter = parsed.data
  const { search, category, minPrice, maxPrice, sortBy, page = 1, limit = 12 } = filter

  const where: Prisma.RentalUnitWhereInput = {
    isActive: true,
    operationalStatus: OperationalStatus.AVAILABLE,
  }
  if (search) where.name = { contains: search, mode: 'insensitive' }
  if (category) where.category = { slug: category }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.dailyRate = {}
    if (minPrice !== undefined) where.dailyRate.gte = minPrice
    if (maxPrice !== undefined) where.dailyRate.lte = maxPrice
  }

  let orderBy: Prisma.RentalUnitOrderByWithRelationInput = { createdAt: 'desc' }
  if (sortBy === 'price_asc') orderBy = { dailyRate: 'asc' }
  else if (sortBy === 'price_desc') orderBy = { dailyRate: 'desc' }
  else if (sortBy === 'name_asc') orderBy = { name: 'asc' }
  else if (sortBy === 'name_desc') orderBy = { name: 'desc' }

  const skip = (page - 1) * limit

  const [units, total] = await Promise.all([
    prisma.rentalUnit.findMany({
      where,
      include: { category: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.rentalUnit.count({ where }),
  ])

  // Track analytics
  prisma.analyticsEvent.create({ data: { eventType: 'catalog_view', metadata: JSON.stringify({ filters: params }) } }).catch(() => {})

  return { units, total, page, limit, totalPages: Math.ceil(total / limit), filter }
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedParams = await searchParams
  const [{ units, total, page, limit, totalPages, filter }, categories] = await Promise.all([
    getUnits(resolvedParams),
    getCategories(),
  ])

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-main py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Katalog Unit</h1>
          <p className="text-gray-500 text-sm">
            {total > 0 ? `Menampilkan ${total} unit tersedia` : 'Tidak ada unit yang cocok dengan filter'}
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <CatalogFilter
              categories={categories}
              currentFilter={filter}
            />
          </aside>

          {/* Unit Grid */}
          <div className="flex-1">
            {units.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                  {units.map((unit) => (
                    <UnitCard
                      key={unit.id}
                      unit={{
                        ...unit,
                        dailyRate: unit.dailyRate.toString(),
                        depositAmount: unit.depositAmount.toString(),
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <a
                        key={p}
                        href={`?${new URLSearchParams({ ...resolvedParams as Record<string, string>, page: String(p) }).toString()}`}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-orange-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada unit ditemukan</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Coba ubah filter pencarian Anda atau hapus beberapa filter
                </p>
                <a href="/katalog" className="btn-outline text-sm">
                  Reset Filter
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
