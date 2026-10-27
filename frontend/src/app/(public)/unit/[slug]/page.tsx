import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatRupiah, formatDate } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, MapPin, Clock, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import BookingForm from '@/components/booking/BookingForm'
import ProductGallery from '@/components/catalog/ProductGallery'
import type { Metadata } from 'next'

interface UnitDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: UnitDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const unit = await prisma.rentalUnit.findUnique({
    where: { slug, isActive: true },
    include: { category: true },
  })
  if (!unit) return { title: 'Unit Tidak Ditemukan' }
  return {
    title: unit.name,
    description: unit.description || `Sewa ${unit.name} dengan tarif ${formatRupiah(Number(unit.dailyRate))}/hari di Gamas Rent.`,
    openGraph: {
      title: unit.name,
      description: unit.description || undefined,
    },
  }
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { slug } = await params

  const [unit, settings] = await Promise.all([
    prisma.rentalUnit.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    prisma.businessSetting.findFirst(),
  ])

  if (!unit) notFound()

  // Track analytics
  prisma.analyticsEvent.create({ data: { eventType: 'unit_view', unitId: unit.id } }).catch(() => {})

  const isAvailable = unit.operationalStatus === 'AVAILABLE'
  let specs: Record<string, string> = {}
  try {
    if (unit.specifications) {
      specs = typeof unit.specifications === 'string' ? JSON.parse(unit.specifications) : unit.specifications
    }
  } catch {
    specs = {}
  }

  let facilities: string[] = []
  try {
    if (unit.facilities) {
      facilities = typeof unit.facilities === 'string' ? JSON.parse(unit.facilities) : unit.facilities
    }
  } catch {
    facilities = []
  }

  return (
    <div className="pt-[72px] min-h-screen bg-gray-50">
      <div className="container-main py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/katalog" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Katalog
          </Link>
          <span>/</span>
          <Link href={`/katalog?category=${unit.category.slug}`} className="hover:text-orange-600 transition-colors">
            {unit.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{unit.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Gallery with Full Uncropped View and Lightbox Modal */}
            <ProductGallery images={unit.images} unitName={unit.name} />

            {/* Details */}
            <div className="card p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full mb-2 inline-block">
                    {unit.category.name}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 mt-2">{unit.name}</h1>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                  isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {isAvailable 
                    ? <><CheckCircle className="w-3.5 h-3.5" /> Tersedia</>
                    : <><AlertCircle className="w-3.5 h-3.5" /> {unit.operationalStatus === 'MAINTENANCE' ? 'Maintenance' : 'Tidak Tersedia'}</>
                  }
                </div>
              </div>

              {unit.description && (
                <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">{unit.description}</p>
              )}

              {/* Specs */}
              {specs && Object.keys(specs).length > 0 && (
                <div className="mb-6">
                  <h2 className="font-semibold text-gray-900 mb-3">Spesifikasi</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                        <span className="text-xs text-gray-500 font-medium">{key}</span>
                        <span className="text-xs text-gray-900 font-semibold ml-auto">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {facilities.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-semibold text-gray-900 mb-3">Fasilitas</h2>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((fac) => (
                      <span key={fac} className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rental Terms */}
              {unit.rentalTerms && (
                <div>
                  <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-500" /> Syarat Sewa
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed bg-orange-50 border border-orange-100 rounded-xl p-4">
                    {unit.rentalTerms}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Pricing + Booking Form */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Pricing Card */}
              <div className="card p-6">
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-black text-gray-900">{formatRupiah(Number(unit.dailyRate))}</span>
                  <span className="text-gray-500 text-sm mb-1">/ hari</span>
                </div>
                {Number(unit.depositAmount) > 0 && (
                  <p className="text-sm text-gray-500 mb-4">
                    Deposit: {formatRupiah(Number(unit.depositAmount))}
                  </p>
                )}
                <div className="h-px bg-gray-100 my-4"></div>
                {isAvailable ? (
                  <BookingForm
                    unit={{
                      id: unit.id,
                      name: unit.name,
                      slug: unit.slug,
                      dailyRate: Number(unit.dailyRate),
                      depositAmount: Number(unit.depositAmount),
                    }}
                    whatsappNumber={settings?.whatsappNumber || '6288223004545'}
                  />
                ) : (
                  <div className="text-center py-6">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Unit ini sedang tidak tersedia</p>
                    <p className="text-sm text-gray-400 mt-1">Cek kembali nanti atau pilih unit lain</p>
                    <Link href="/katalog" className="btn-outline mt-4 text-sm">
                      Lihat Unit Lain
                    </Link>
                  </div>
                )}
              </div>

              {/* Info Card */}
              <div className="card p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Konfirmasi Cepat</p>
                    <p className="text-xs text-gray-500">Pesanan dikonfirmasi dalam 1–2 jam kerja</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
