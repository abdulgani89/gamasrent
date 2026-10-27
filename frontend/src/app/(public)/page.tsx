import Link from 'next/link'
import Image from 'next/image'
import { 
  ChevronRight, Shield, Clock, MapPin, CheckCircle, 
  Star, Phone, Car, Package, Truck, Users, ArrowRight,
  Search
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import UnitCard from '@/components/catalog/UnitCard'
import HeroSearchForm from '@/components/catalog/HeroSearchForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gamasrent — Layanan Sewa Inventaris GAMAS UNNES Banyumas',
  description: 'Layanan sewa inventaris resmi GAMAS (Gabungan Mahasiswa Satria) Universitas Negeri Semarang Banyumas. Pilih unit, cek ketersediaan, dan pesan via WhatsApp.',
}

async function getFeaturedUnits() {
  try {
    return await prisma.rentalUnit.findMany({
      where: { isActive: true, isFeatured: true, operationalStatus: 'AVAILABLE' },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
      take: 6,
    })
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { units: { where: { isActive: true } } } } },
      orderBy: { name: 'asc' },
    })
  } catch {
    return []
  }
}

const howToRentSteps = [
  {
    step: '01',
    title: 'Pilih Unit',
    description: 'Browse katalog unit kami dan pilih sesuai kebutuhan Anda. Lihat spesifikasi, fasilitas, dan harga secara transparan.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Pesan via WhatsApp',
    description: 'Isi formulir pemesanan dengan data diri dan tanggal sewa. Sistem kami akan mengecek ketersediaan secara otomatis.',
    icon: Phone,
  },
  {
    step: '03',
    title: 'Konfirmasi Admin',
    description: 'Tim kami akan mengonfirmasi pesanan Anda melalui WhatsApp beserta instruksi pembayaran dan pengambilan unit.',
    icon: CheckCircle,
  },
  {
    step: '04',
    title: 'Mulai Sewa',
    description: 'Datang langsung ke lokasi kami untuk pengambilan unit. Nikmati unit yang sudah siap pakai.',
    icon: Car,
  },
]

const advantages = [
  {
    icon: Shield,
    title: 'Unit Terawat',
    description: 'Setiap unit kami rawat secara rutin untuk memastikan kondisi terbaik.',
  },
  {
    icon: Clock,
    title: 'Proses Cepat',
    description: 'Konfirmasi pesanan dalam hitungan jam, tidak perlu menunggu lama.',
  },
  {
    icon: MapPin,
    title: 'Lokasi Strategis',
    description: 'Pengambilan dan pengembalian unit mudah langsung di lokasi kami.',
  },
  {
    icon: Users,
    title: 'Admin Responsif',
    description: 'Tim kami siap membantu melalui WhatsApp selama jam operasional.',
  },
]

const faqs = [
  {
    q: 'Berapa lama proses konfirmasi pemesanan?',
    a: 'Konfirmasi pesanan biasanya dilakukan dalam 1-2 jam kerja setelah Anda menghubungi kami via WhatsApp.',
  },
  {
    q: 'Apa saja dokumen yang diperlukan?',
    a: 'Dokumen yang diperlukan akan dikomunikasikan oleh admin saat konfirmasi. Biasanya meliputi identitas diri yang berlaku.',
  },
  {
    q: 'Apakah ada deposit?',
    a: 'Deposit bervariasi tergantung jenis unit. Informasi deposit tersedia di halaman detail setiap unit.',
  },
  {
    q: 'Bagaimana jika saya ingin membatalkan pesanan?',
    a: 'Pembatalan dapat dilakukan dengan menghubungi admin. Kebijakan pengembalian deposit mengacu pada syarat dan ketentuan yang berlaku.',
  },
  {
    q: 'Apakah tersedia layanan antar unit?',
    a: 'Saat ini kami hanya melayani pengambilan dan pengembalian unit langsung di lokasi kami (tidak melayani antar ke lokasi).',
  },
]

export default async function HomePage() {
  const [featuredUnits, categories] = await Promise.all([getFeaturedUnits(), getCategories()])

  return (
    <>
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <section className="hero-gradient relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full"></div>
        </div>

        <div className="container-main relative z-10 pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Layanan Sewa Inventaris GAMAS UNNES Banyumas
            </div>

            <h1 className="heading-hero text-white mb-6">
              Sewa Inventaris{' '}
              <span className="text-amber-400">GAMAS</span>{' '}
              Mudah &amp; Terpercaya.
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto">
              Layanan sewa inventaris resmi dari unit kegiatan mahasiswa GAMAS Universitas Negeri Semarang — Banyumas.
              Cek ketersediaan dan pesan via WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/katalog" id="hero-cta-katalog" className="btn-primary px-8 py-4 text-base w-full sm:w-auto">
                Lihat Katalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/cara-sewa" id="hero-cta-cara-sewa" className="btn-secondary px-8 py-4 text-base w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                Cara Sewa
              </Link>
            </div>
          </div>

          {/* Quick Search Form */}
          <div className="max-w-2xl mx-auto">
            <HeroSearchForm categories={categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))} />
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 0 960 60 720 30C480 0 240 60 0 30V60Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* ─── Categories ──────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container-main">
            <div className="text-center mb-12">
              <h2 className="heading-section text-gray-900 mb-3">Kategori Unit</h2>
              <p className="text-gray-500 max-w-lg mx-auto">Pilih dari berbagai kategori unit rental yang kami sediakan</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/katalog?category=${category.slug}`}
                  className="group card-hover p-6 text-center"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-red-600 transition-colors">
                    <Package className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-400">{category._count.units} unit</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured Units ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="heading-section text-gray-900 mb-3">Unit Unggulan</h2>
              <p className="text-gray-500">Unit pilihan terpopuler dari koleksi kami</p>
            </div>
            <Link href="/katalog" className="hidden sm:flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredUnits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredUnits.map((unit) => (
                <UnitCard key={unit.id} unit={{
                  ...unit,
                  dailyRate: unit.dailyRate.toString(),
                  depositAmount: unit.depositAmount.toString(),
                }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Car className="w-16 h-16 mx-auto mb-4 text-gray-200" />
              <p>Belum ada unit unggulan. Cek kembali nanti!</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/katalog" className="btn-outline">
              Lihat Semua Unit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How to Rent ─────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-14">
            <h2 className="heading-section text-gray-900 mb-3">Cara Menyewa</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Proses sederhana dalam 4 langkah mudah</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howToRentSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative">
                  {index < howToRentSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%_-_8px)] w-full h-px border-t-2 border-dashed border-gray-200 z-0"></div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/25">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-3xl font-black text-gray-100">{step.step}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/cara-sewa" className="btn-primary">
              Pelajari Lebih Lanjut <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Advantages ──────────────────────────────────────────── */}
      <section className="py-20 bg-[#1a1f2e]">
        <div className="container-main">
          <div className="text-center mb-14">
            <h2 className="heading-section text-white mb-3">Mengapa Gamasrent?</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Komitmen kami untuk memberikan layanan rental terbaik</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv) => {
              const Icon = adv.icon
              return (
                <div key={adv.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-white text-base mb-2">{adv.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{adv.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white" id="faq">
        <div className="container-main">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-section text-gray-900 mb-3">Pertanyaan Umum</h2>
              <p className="text-gray-500">Jawaban atas pertanyaan yang sering ditanyakan</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group card border border-gray-200 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                    {faq.q}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm mb-4">Masih ada pertanyaan lain?</p>
              <Link href="/kontak" className="btn-outline">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-red-700 to-red-800">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Siap untuk menyewa?</h2>
          <p className="text-red-100 mb-8 max-w-md mx-auto">
            Temukan unit inventaris GAMAS yang tepat dan pesan sekarang via WhatsApp.
          </p>
          <Link href="/katalog" id="homepage-final-cta" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-700 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-lg">
            Mulai Sewa Sekarang <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
