'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatRupiah, formatDate, formatDateTime, buildWhatsAppUrl } from '@/lib/utils'
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  PlayCircle,
  XCircle,
  Search,
  MessageCircle,
  AlertCircle,
  Loader2,
  MapPin,
  User,
  Phone,
  FileText,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react'

interface BookingItem {
  id: string
  referenceCode: string
  customerId: string
  unitId: string
  startAt: string
  endAt: string
  pickupOption: string
  deliveryLocation?: string | null
  dailyRateSnapshot: number
  duration: number
  extraCost: number
  totalPrice: number
  status: string
  holdExpiresAt?: string | null
  customerNotes?: string | null
  adminNotes?: string | null
  createdAt: string
  customer: {
    id: string
    name: string
    phone: string
    email?: string | null
  }
  unit: {
    id: string
    name: string
    slug: string
    dailyRate: number
  }
}

interface BookingManagerProps {
  initialBookings: BookingItem[]
  defaultStatus?: string
  defaultSearch?: string
}

export default function BookingManager({
  initialBookings,
  defaultStatus = '',
  defaultSearch = '',
}: BookingManagerProps) {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings)
  const [selectedStatus, setSelectedStatus] = useState(defaultStatus)
  const [search, setSearch] = useState(defaultSearch)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Status Modal State
  const [statusModalBooking, setStatusModalBooking] = useState<BookingItem | null>(null)
  const [targetStatus, setTargetStatus] = useState<string>('')
  const [adminNote, setAdminNote] = useState<string>('')

  const statusCounts = {
    all: bookings.length,
    PENDING: bookings.filter((b) => b.status === 'PENDING').length,
    CONFIRMED: bookings.filter((b) => b.status === 'CONFIRMED').length,
    ACTIVE: bookings.filter((b) => b.status === 'ACTIVE').length,
    COMPLETED: bookings.filter((b) => b.status === 'COMPLETED').length,
    CANCELLED_OR_REJECTED: bookings.filter(
      (b) => b.status === 'CANCELLED' || b.status === 'REJECTED'
    ).length,
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.referenceCode.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.phone.includes(search) ||
      b.unit.name.toLowerCase().includes(search.toLowerCase())

    let matchesStatus = true
    if (selectedStatus === 'CANCELLED_OR_REJECTED') {
      matchesStatus = b.status === 'CANCELLED' || b.status === 'REJECTED'
    } else if (selectedStatus) {
      matchesStatus = b.status === selectedStatus
    }

    return matchesSearch && matchesStatus
  })

  const openStatusModal = (booking: BookingItem, newStatus: string) => {
    setStatusModalBooking(booking)
    setTargetStatus(newStatus)
    setAdminNote('')
    setErrorMsg(null)
  }

  const handleUpdateStatus = async () => {
    if (!statusModalBooking || !targetStatus) return
    setLoadingAction(statusModalBooking.id)
    setErrorMsg(null)

    try {
      const res = await fetch(`/api/admin/bookings/${statusModalBooking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          adminNotes: adminNote || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal mengubah status reservasi')

      setBookings((prev) =>
        prev.map((b) => (b.id === statusModalBooking.id ? { ...b, status: targetStatus, adminNotes: adminNote || b.adminNotes } : b))
      )
      setSuccessMsg(`Status reservasi ${statusModalBooking.referenceCode} berhasil diubah ke ${targetStatus}!`)
      setStatusModalBooking(null)
      router.refresh()
    } catch (err: unknown) {
      setErrorMsg((err as Error).message)
    } finally {
      setLoadingAction(null)
    }
  }

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Manajemen Reservasi</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verifikasi pemesanan sewa, kontrol status jadwal, dan hubungi pelanggan via WhatsApp
          </p>
        </div>

        <Link
          href="/admin-panel/calendar"
          className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>+ Blokir Jadwal di Kalender</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { key: '', label: 'Semua Reservasi', count: statusCounts.all },
          { key: 'PENDING', label: 'Menunggu', count: statusCounts.PENDING, highlight: statusCounts.PENDING > 0 },
          { key: 'CONFIRMED', label: 'Dikonfirmasi', count: statusCounts.CONFIRMED },
          { key: 'ACTIVE', label: 'Sedang Berjalan', count: statusCounts.ACTIVE },
          { key: 'COMPLETED', label: 'Selesai', count: statusCounts.COMPLETED },
          { key: 'CANCELLED_OR_REJECTED', label: 'Batal / Tolak', count: statusCounts.CANCELLED_OR_REJECTED },
        ].map((tab) => {
          const active = selectedStatus === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab.highlight
                    ? 'bg-amber-500 text-white animate-pulse'
                    : active
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari kode booking, nama penyewa, nomor HP, atau nama unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
        />
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Kode & Waktu</th>
                <th className="py-3.5 px-6">Pelanggan</th>
                <th className="py-3.5 px-6">Unit Disewa</th>
                <th className="py-3.5 px-6">Jadwal & Durasi</th>
                <th className="py-3.5 px-6">Pengambilan</th>
                <th className="py-3.5 px-6">Total Biaya</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Aksi Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada reservasi yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isLoading = loadingAction === b.id

                  const waMessage = `Halo kak ${b.customer.name}, perihal pesanan rental di Gamas Rent:
- Kode Reservasi: ${b.referenceCode}
- Unit: ${b.unit.name}
- Periode: ${formatDate(b.startAt)} s/d ${formatDate(b.endAt)} (${b.duration} hari)
- Total Biaya: ${formatRupiah(b.totalPrice)}

Status pesanan saat ini: ${b.status}. Silakan konfirmasi untuk proses serah terima unit.`

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono text-xs font-bold text-slate-900">
                          {b.referenceCode}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {formatDateTime(b.createdAt)}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                            {b.customer.name}
                          </span>
                          {(b.referenceCode.startsWith('GR-INT-') || b.totalPrice === 0 || b.customer.name.startsWith('[Internal')) && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                              🏛️ GAMAS
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{b.customer.phone}</span>
                        </div>
                        {b.customerNotes && (
                          <div className="text-[11px] text-slate-400 mt-1 italic max-w-xs">
                            &quot;{b.customerNotes}&quot;
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 font-medium text-slate-900 text-xs">
                        <Link href={`/unit/${b.unit.slug}`} target="_blank" className="hover:text-orange-600">
                          {b.unit.name}
                        </Link>
                      </td>

                      <td className="py-4 px-6 text-xs">
                        <div className="font-semibold text-slate-800">
                          {formatDate(b.startAt)} — {formatDate(b.endAt)}
                        </div>
                        <div className="text-slate-400 font-medium">({b.duration} hari sewa)</div>
                      </td>

                      <td className="py-4 px-6 text-xs">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            b.pickupOption === 'DELIVERY'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {b.pickupOption === 'DELIVERY' ? 'Antar Alamat' : 'Ambil di Toko'}
                        </span>
                        {b.deliveryLocation && (
                          <div className="text-[11px] text-slate-500 mt-1 truncate max-w-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {b.deliveryLocation}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {(b.referenceCode.startsWith('GR-INT-') || b.totalPrice === 0 || b.customer.name.startsWith('[Internal')) ? (
                            <span className="text-purple-700 font-bold">Rp 0 (Internal)</span>
                          ) : (
                            formatRupiah(b.totalPrice)
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">{statusBadge(b.status)}</td>

                      <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                        {/* WhatsApp Button */}
                        <a
                          href={buildWhatsAppUrl(b.customer.phone, waMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                          title="Hubungi Pelanggan via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WA
                        </a>

                        {/* Status Action Buttons depending on current status */}
                        {b.status === 'PENDING' && (
                          <>
                            <button
                              disabled={isLoading}
                              onClick={() => openStatusModal(b, 'CONFIRMED')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                            >
                              Konfirmasi
                            </button>
                            <button
                              disabled={isLoading}
                              onClick={() => openStatusModal(b, 'REJECTED')}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
                            >
                              Tolak
                            </button>
                          </>
                        )}

                        {b.status === 'CONFIRMED' && (
                          <>
                            <button
                              disabled={isLoading}
                              onClick={() => openStatusModal(b, 'ACTIVE')}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                            >
                              Mulai Sewa
                            </button>
                            <button
                              disabled={isLoading}
                              onClick={() => openStatusModal(b, 'CANCELLED')}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
                            >
                              Batal
                            </button>
                          </>
                        )}

                        {b.status === 'ACTIVE' && (
                          <button
                            disabled={isLoading}
                            onClick={() => openStatusModal(b, 'COMPLETED')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors"
                          >
                            Selesaikan
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Confirmation Modal */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">
                Ubah Status Reservasi
              </h3>
              <button
                onClick={() => setStatusModalBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <p>
                  <strong className="text-slate-700">Kode:</strong> {statusModalBooking.referenceCode}
                </p>
                <p>
                  <strong className="text-slate-700">Unit:</strong> {statusModalBooking.unit.name}
                </p>
                <p>
                  <strong className="text-slate-700">Penyewa:</strong> {statusModalBooking.customer.name} ({statusModalBooking.customer.phone})
                </p>
                <p>
                  <strong className="text-slate-700">Perubahan:</strong>{' '}
                  <span className="font-semibold text-slate-500">{statusModalBooking.status}</span> →{' '}
                  <span className="font-bold text-orange-600">{targetStatus}</span>
                </p>
              </div>

              {targetStatus === 'CONFIRMED' && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                  Sistem akan memverifikasi tidak ada benturan jadwal dengan reservasi lain yang telah dikonfirmasi pada unit ini.
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Admin (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Contoh: DP 50% sudah diterima / Unit diambil oleh penyewa..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusModalBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={loadingAction === statusModalBooking.id}
                  onClick={handleUpdateStatus}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 flex items-center gap-2"
                >
                  {loadingAction === statusModalBooking.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    'Konfirmasi Perubahan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
