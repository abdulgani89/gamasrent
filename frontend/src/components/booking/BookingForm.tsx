'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MessageCircle, Loader2, Calendar, User, Phone, Mail, MapPin, ChevronDown, AlertCircle } from 'lucide-react'
import { formatRupiah, calculateDuration, buildWhatsAppUrl, formatDate, formatDateTime } from '@/lib/utils'

const bookingFormSchema = z.object({
  customerName: z.string().min(2, 'Nama minimal 2 karakter'),
  customerPhone: z.string().min(9, 'Nomor telepon minimal 9 digit').regex(/^\+?[0-9\s-]+$/, 'Format nomor tidak valid'),
  customerEmail: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  startTime: z.string().min(1, 'Jam mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  endTime: z.string().min(1, 'Jam selesai wajib diisi'),
  pickupOption: z.string(),
  deliveryLocation: z.string().optional(),
  customerNotes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingFormSchema>

interface BookingFormProps {
  unit: {
    id: string
    name: string
    slug: string
    dailyRate: number
    depositAmount: number
  }
  whatsappNumber: string
}

interface BookingResult {
  referenceCode: string
  bookingId: string
  startAt: string
  endAt: string
  duration: number
  dailyRate: number
  extraCost: number
  totalPrice: number
  pickupOption: string
  deliveryLocation?: string
}

export default function BookingForm({ unit, whatsappNumber }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      pickupOption: 'SELF_PICKUP',
      startTime: '08:00',
      endTime: '08:00',
    },
  })

  const watchedValues = watch()
  const startDate = watch('startDate')
  const startTime = watch('startTime')
  const endDate = watch('endDate')
  const endTime = watch('endTime')

  // Calculate price preview
  let previewDuration = 0
  let previewTotal = 0
  if (startDate && endDate) {
    const start = new Date(`${startDate}T${startTime || '08:00'}:00`)
    const end = new Date(`${endDate}T${endTime || '08:00'}:00`)
    if (end > start) {
      previewDuration = calculateDuration(start, end)
      previewTotal = previewDuration * unit.dailyRate
    }
  }

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const startAt = new Date(`${data.startDate}T${data.startTime}:00`).toISOString()
      const endAt = new Date(`${data.endDate}T${data.endTime}:00`).toISOString()

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId: unit.id,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || undefined,
          startAt,
          endAt,
          pickupOption: 'SELF_PICKUP',
          customerNotes: data.customerNotes,
          extraCost: 0,
        }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Gagal membuat booking')
      setBookingResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWhatsAppClick = () => {
    if (!bookingResult) return

    // Track analytics
    fetch('/api/analytics', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ eventType: 'whatsapp_click', unitId: unit.id }) }).catch(() => {})

    const message = `Halo Gamasrent, saya ingin mengajukan pemesanan.

Nomor Referensi: ${bookingResult.referenceCode}
Nama: ${watchedValues.customerName}
Unit: ${unit.name}
Tanggal Mulai: ${formatDateTime(bookingResult.startAt)}
Tanggal Selesai: ${formatDateTime(bookingResult.endAt)}
Durasi: ${bookingResult.duration} hari
Tarif: ${formatRupiah(bookingResult.dailyRate)}/hari
${bookingResult.extraCost > 0 ? `Biaya Tambahan: ${formatRupiah(bookingResult.extraCost)}\n` : ''}Estimasi Total: ${formatRupiah(bookingResult.totalPrice)}
Pengambilan: Ambil langsung di lokasi
${watchedValues.customerNotes ? `Catatan: ${watchedValues.customerNotes}\n` : ''}
Mohon konfirmasi ketersediaan dan persyaratan sewa. Terima kasih.`

    const url = buildWhatsAppUrl(whatsappNumber, message)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (bookingResult) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
            <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
            Reservasi Berhasil Dibuat!
          </div>
          <p className="text-sm text-green-600">
            Kode referensi: <strong className="font-mono">{bookingResult.referenceCode}</strong>
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Mulai</span>
            <span className="font-medium">{formatDateTime(bookingResult.startAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Selesai</span>
            <span className="font-medium">{formatDateTime(bookingResult.endAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Durasi</span>
            <span className="font-medium">{bookingResult.duration} hari</span>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex justify-between font-bold text-base">
            <span>Estimasi Total</span>
            <span className="text-orange-600">{formatRupiah(bookingResult.totalPrice)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          ⚠️ Status pesanan masih <strong>PENDING</strong>. Tekan tombol di bawah untuk mengirim detail ke WhatsApp admin dan menunggu konfirmasi.
        </p>

        <button
          onClick={handleWhatsAppClick}
          id="booking-whatsapp-btn"
          className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-md"
        >
          <MessageCircle className="w-5 h-5" />
          Konfirmasi via WhatsApp
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="booking-form">
      {/* Personal Info */}
      <div>
        <label className="label-base">Nama Lengkap *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="booking-name"
            {...register('customerName')}
            className="input-base pl-9"
            placeholder="Nama lengkap Anda"
          />
        </div>
        {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
      </div>

      <div>
        <label className="label-base">Nomor Telepon / WhatsApp *</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="booking-phone"
            {...register('customerPhone')}
            className="input-base pl-9"
            placeholder="08xx-xxxx-xxxx"
            type="tel"
          />
        </div>
        {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>}
      </div>

      <div>
        <label className="label-base">Email (opsional)</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="booking-email"
            {...register('customerEmail')}
            className="input-base pl-9"
            placeholder="email@example.com"
            type="email"
          />
        </div>
        {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-base">Tanggal Mulai *</label>
          <input
            id="booking-start-date"
            {...register('startDate')}
            type="date"
            min={today}
            className="input-base text-sm"
          />
          {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="label-base">Jam</label>
          <input
            id="booking-start-time"
            {...register('startTime')}
            type="time"
            className="input-base text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-base">Tanggal Selesai *</label>
          <input
            id="booking-end-date"
            {...register('endDate')}
            type="date"
            min={startDate || today}
            className="input-base text-sm"
          />
          {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
        </div>
        <div>
          <label className="label-base">Jam</label>
          <input
            id="booking-end-time"
            {...register('endTime')}
            type="time"
            className="input-base text-sm"
          />
        </div>
      </div>

      {/* Price Preview */}
      {previewDuration > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>{formatRupiah(unit.dailyRate)} × {previewDuration} hari</span>
            <span className="font-semibold">{formatRupiah(previewTotal)}</span>
          </div>
          {unit.depositAmount > 0 && (
            <div className="flex justify-between text-gray-500 mt-1">
              <span>Deposit</span>
              <span>{formatRupiah(unit.depositAmount)}</span>
            </div>
          )}
        </div>
      )}

      {/* Pickup Information */}
      <div>
        <label className="label-base">Pengambilan Unit</label>
        <div className="flex items-start gap-2.5 p-3.5 bg-orange-50 border border-orange-200/80 rounded-xl text-slate-700 text-sm">
          <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800 text-xs sm:text-sm">Ambil Langsung di Lokasi</p>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Pengambilan dan pengembalian unit dilakukan langsung di tempat (tidak melayani antar ke lokasi).</p>
          </div>
        </div>
        <input {...register('pickupOption')} type="hidden" value="SELF_PICKUP" />
      </div>

      {/* Notes */}
      <div>
        <label className="label-base">Catatan (opsional)</label>
        <textarea
          id="booking-notes"
          {...register('customerNotes')}
          className="input-base h-20 resize-none"
          placeholder="Catatan tambahan untuk admin..."
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        id="booking-submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl transition-colors"
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
        ) : (
          <>Buat Reservasi</>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Setelah reservasi berhasil, Anda akan mendapat kode referensi dan diarahkan untuk konfirmasi via WhatsApp.
      </p>
    </form>
  )
}
