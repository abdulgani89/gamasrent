import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatRupiah, formatDate, formatDateTime, buildWhatsAppUrl } from '@/lib/utils'
import {
  Package,
  Clock,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  Calendar,
  Eye,
  Plus,
} from 'lucide-react'
import { dashboardService } from '@/services/dashboard.service'


export default async function AdminDashboardPage() {
  const [stats, recentBookings, analytics, businessSetting] = await Promise.all([
    dashboardService.getStats(),
    dashboardService.getRecentBookings(8),
    dashboardService.getAnalyticsSummary(),
    prisma.businessSetting.findFirst(),
  ])

  const statusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Menunggu
          </span>
        )
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" /> Dikonfirmasi
          </span>
        )
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <PlayCircle className="w-3 h-3" /> Berjalan
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Selesai
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Dibatalkan
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Ditolak
          </span>
        )
      default:
        return <span className="text-xs text-slate-500">{status}</span>
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Selamat Datang di Admin Panel 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Kelola katalog rental, verifikasi reservasi pelanggan, dan pantau ketersediaan unit secara terpusat.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/admin-panel/units"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-all shadow-md shadow-orange-500/25"
            >
              <Plus className="w-4 h-4" /> Tambah Unit
            </Link>
            <Link
              href="/admin-panel/calendar"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all border border-white/15"
            >
              <Calendar className="w-4 h-4" /> Kalender Jadwal
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Reservations Alert if any */}
      {stats.pendingBookings > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Ada {stats.pendingBookings} reservasi baru menunggu verifikasi!
              </p>
              <p className="text-xs text-amber-700">
                Segera konfirmasi agar jadwal terarsip dan unit tidak bertabrakan dengan calon penyewa lain.
              </p>
            </div>
          </div>
          <Link
            href="/admin-panel/bookings?status=PENDING"
            className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shrink-0"
          >
            Periksa Sekarang →
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Unit Siap Disewa</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.totalActiveUnits} Unit</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {stats.maintenanceUnits} unit maintenance
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Menunggu Verifikasi</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.pendingBookings} Reservasi</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Status pending</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Dikonfirmasi & Aktif</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">
              {stats.confirmedBookings + stats.activeRentals} Sewa
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {stats.activeRentals} unit sedang dipakai
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Estimasi Nilai Sewa</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">
              {formatRupiah(stats.estimatedValue)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {stats.completedRentals} rental sukses selesai
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Funnel Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Aktivitas Calon Pelanggan (30 Hari Terakhir)</h2>
            <p className="text-xs text-slate-500">Pantau konversi dari pencarian hingga transaksi selesai</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-xs text-slate-500">Kunjungan Katalog</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{analytics.catalogViews}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <p className="text-xs text-emerald-700">Klik WhatsApp</p>
            <p className="text-2xl font-bold text-emerald-800 mt-1">{analytics.whatsappClicks}</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <p className="text-xs text-blue-700">Formulir Booking Dibuat</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">{analytics.bookingsCreated}</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-center">
            <p className="text-xs text-purple-700">Booking Terkonfirmasi</p>
            <p className="text-2xl font-bold text-purple-800 mt-1">{analytics.bookingsConfirmed}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Reservasi Terbaru</h2>
            <p className="text-xs text-slate-500">Daftar pemesanan rental yang masuk melalui website</p>
          </div>
          <Link
            href="/admin-panel/bookings"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            Kelola Semua Reservasi <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Belum ada reservasi. Anda dapat mencoba melakukan reservasi dari halaman katalog publik untuk melihat alurnya!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Kode Booking</th>
                  <th className="py-3.5 px-6">Unit</th>
                  <th className="py-3.5 px-6">Pelanggan</th>
                  <th className="py-3.5 px-6">Jadwal Sewa</th>
                  <th className="py-3.5 px-6">Total Biaya</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-800">
                      {b.referenceCode}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      <Link href={`/unit/${b.unit.slug}`} target="_blank" className="hover:text-orange-600">
                        {b.unit.name}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">{b.customer.name}</div>
                      <div className="text-xs text-slate-400">{b.customer.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-xs">
                      <div>{formatDate(b.startAt)} — {formatDate(b.endAt)}</div>
                      <div className="text-slate-400 font-medium">({b.duration} hari)</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {formatRupiah(Number(b.totalPrice))}
                    </td>
                    <td className="py-4 px-6">{statusBadge(b.status)}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <a
                        href={buildWhatsAppUrl(
                          b.customer.phone,
                          `Halo ${b.customer.name}, perihal pesanan rental di Gamas Rent dengan kode ${b.referenceCode}...`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium transition-colors"
                        title="Chat WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WA
                      </a>
                      <Link
                        href={`/admin-panel/bookings?search=${b.referenceCode}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
