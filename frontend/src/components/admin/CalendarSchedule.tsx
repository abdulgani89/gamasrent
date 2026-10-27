'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDate, formatRupiah } from '@/lib/utils'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  PlayCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react'
import InternalScheduleModal from '@/components/admin/InternalScheduleModal'

interface UnitSimple {
  id: string
  name: string
  slug: string
}

interface CalendarBooking {
  id: string
  referenceCode: string
  startAt: string
  endAt: string
  status: string
  unitId: string
  totalPrice: number
  unit: {
    id: string
    name: string
    slug: string
  }
  customer: {
    name: string
    phone: string
  }
}

interface CalendarScheduleProps {
  units: UnitSimple[]
  initialBookings: CalendarBooking[]
  initialYear: number
  initialMonth: number
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function CalendarSchedule({
  units,
  initialBookings,
  initialYear,
  initialMonth,
}: CalendarScheduleProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [selectedUnitId, setSelectedUnitId] = useState<string>('')
  const [bookings, setBookings] = useState<CalendarBooking[]>(initialBookings)
  const [loading, setLoading] = useState(false)
  const [activeBookingDetail, setActiveBookingDetail] = useState<CalendarBooking | null>(null)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

  const isInternalBooking = (b: CalendarBooking) =>
    b.referenceCode.startsWith('GR-INT-') ||
    b.customer?.name?.startsWith('[Internal GAMAS]') ||
    b.totalPrice === 0

  const fetchBookings = async (y: number, m: number, uId?: string) => {
    setLoading(true)
    try {
      const url = new URL('/api/admin/calendar', window.location.origin)
      url.searchParams.set('year', y.toString())
      url.searchParams.set('month', m.toString())
      if (uId) url.searchParams.set('unitId', uId)

      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePrevMonth = () => {
    let newM = month - 1
    let newY = year
    if (newM < 1) {
      newM = 12
      newY -= 1
    }
    setMonth(newM)
    setYear(newY)
    fetchBookings(newY, newM, selectedUnitId)
  }

  const handleNextMonth = () => {
    let newM = month + 1
    let newY = year
    if (newM > 12) {
      newM = 1
      newY += 1
    }
    setMonth(newM)
    setYear(newY)
    fetchBookings(newY, newM, selectedUnitId)
  }

  const handleUnitFilter = (uId: string) => {
    setSelectedUnitId(uId)
    fetchBookings(year, month, uId)
  }

  // Days in month calculation
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyPrefix = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  // Filter bookings for a given day
  const getBookingsForDay = (day: number) => {
    const dayDate = new Date(year, month - 1, day, 12, 0, 0)
    return bookings.filter((b) => {
      const start = new Date(b.startAt)
      const end = new Date(b.endAt)
      return dayDate >= start && dayDate <= end
    })
  }

  const getStatusColor = (b: CalendarBooking) => {
    if (isInternalBooking(b)) {
      return 'bg-purple-100 text-purple-900 border-purple-300 font-semibold'
    }
    switch (b.status) {
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Kalender Jadwal Sewa</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Visualisasi reservasi aktif, ketersediaan unit, dan pencegahan bentrok jadwal
          </p>
        </div>

        {/* Actions & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsBlockModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:shadow"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>+ Blokir Jadwal Internal GAMAS</span>
          </button>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedUnitId}
              onChange={(e) => handleUnitFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            >
              <option value="">Semua Unit Rental</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Header Navigation */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-orange-500" />
          {MONTH_NAMES[month - 1]} {year}
          {loading && <span className="text-xs font-normal text-slate-400 animate-pulse">(Memuat...)</span>}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-center text-xs font-bold text-slate-600 py-3">
          {DAY_NAMES.map((d, idx) => (
            <div key={d} className={idx === 0 || idx === 6 ? 'text-rose-500' : ''}>
              {d}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {/* Empty prefix slots */}
          {emptyPrefix.map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-[100px] sm:min-h-[120px] bg-slate-50/40 p-2" />
          ))}

          {/* Actual days */}
          {daysArray.map((day) => {
            const dayBookings = getBookingsForDay(day)
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === month - 1 &&
              new Date().getFullYear() === year

            return (
              <div
                key={day}
                className={`min-h-[100px] sm:min-h-[120px] p-2 flex flex-col transition-colors ${
                  isToday ? 'bg-orange-50/30' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {dayBookings.length} sewa
                    </span>
                  )}
                </div>

                {/* Booking chips for this day */}
                <div className="flex-1 space-y-1 overflow-y-auto max-h-[80px]">
                  {dayBookings.map((b) => {
                    const isInt = isInternalBooking(b)
                    return (
                      <button
                        key={b.id}
                        onClick={() => setActiveBookingDetail(b)}
                        className={`w-full text-left p-1 rounded-md text-[10px] font-medium border truncate block transition-all hover:scale-[1.02] ${getStatusColor(
                          b
                        )}`}
                      >
                        {isInt ? (
                          <span className="font-bold text-purple-700">🏛️ [GAMAS] {b.unit.name.split(' ')[0]}:</span>
                        ) : (
                          <span className="font-bold">{b.unit.name.split(' ')[0]}:</span>
                        )}{' '}
                        {isInt ? b.customer.name.replace('[Internal GAMAS] ', '') : b.customer.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Keterangan Status:</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
          Dikonfirmasi (CONFIRMED)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
          Sedang Disewa (ACTIVE)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
          Menunggu Konfirmasi (PENDING)
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-purple-800">
          <span className="w-3 h-3 rounded bg-purple-100 border border-purple-300" />
          🏛️ Acara Internal GAMAS (Rp 0)
        </span>
      </div>

      {/* Modal Detail Booking */}
      {activeBookingDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Detail Reservasi</h3>
              <button
                onClick={() => setActiveBookingDetail(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {isInternalBooking(activeBookingDetail) && (
                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs flex items-start gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Keperluan Acara Internal GAMAS</p>
                    <p className="text-[11px] text-purple-700">
                      Unit dikunci khusus untuk keperluan internal organisasi (Tarif Rp 0 / Non-komersial).
                    </p>
                  </div>
                </div>
              )}
              <p>
                <strong className="text-slate-600">Kode:</strong>{' '}
                <span className="font-mono font-bold text-slate-900">
                  {activeBookingDetail.referenceCode}
                </span>
              </p>
              <p>
                <strong className="text-slate-600">Unit:</strong> {activeBookingDetail.unit.name}
              </p>
              <p>
                <strong className="text-slate-600">Penyewa / PIC:</strong>{' '}
                {activeBookingDetail.customer.name} ({activeBookingDetail.customer.phone})
              </p>
              <p>
                <strong className="text-slate-600">Periode:</strong>{' '}
                {formatDate(activeBookingDetail.startAt)} s/d {formatDate(activeBookingDetail.endAt)}
              </p>
              <p>
                <strong className="text-slate-600">Total Harga:</strong>{' '}
                <span className={`font-semibold ${isInternalBooking(activeBookingDetail) ? 'text-purple-700' : 'text-orange-600'}`}>
                  {isInternalBooking(activeBookingDetail) ? 'Rp 0 (Internal GAMAS)' : formatRupiah(activeBookingDetail.totalPrice)}
                </span>
              </p>
              <p>
                <strong className="text-slate-600">Status:</strong>{' '}
                <span className="font-bold text-slate-800">{activeBookingDetail.status}</span>
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <Link
                href={`/admin-panel/bookings?search=${activeBookingDetail.referenceCode}`}
                className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                Kelola di Menu Reservasi <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Blokir Jadwal Internal GAMAS */}
      <InternalScheduleModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        units={units}
        onSuccess={() => {
          fetchBookings(year, month, selectedUnitId)
        }}
      />
    </div>
  )
}
