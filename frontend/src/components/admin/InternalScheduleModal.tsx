'use client'

import { useState } from 'react'
import { X, Calendar, User, Phone, FileText, AlertCircle, Loader2, ShieldAlert } from 'lucide-react'

interface UnitSimple {
  id: string
  name: string
}

interface InternalScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  units: UnitSimple[]
  onSuccess: () => void
}

export default function InternalScheduleModal({
  isOpen,
  onClose,
  units,
  onSuccess,
}: InternalScheduleModalProps) {
  const [unitId, setUnitId] = useState(units[0]?.id || '')
  const [eventName, setEventName] = useState('')
  const [instansi, setInstansi] = useState('')
  const [picName, setPicName] = useState('')
  const [picPhone, setPicPhone] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!unitId || !eventName || !instansi || !picName || !startAt || !endAt) {
      setErrorMsg('Mohon lengkapi semua kolom wajib (Unit, Nama Acara, Instansi, PIC, Mulai & Selesai).')
      return
    }

    const startDate = new Date(startAt)
    const endDate = new Date(endAt)

    if (endDate <= startDate) {
      setErrorMsg('Tanggal & jam selesai harus setelah tanggal mulai.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          eventName,
          instansi,
          picName,
          picPhone,
          startAt: startDate.toISOString(),
          endAt: endDate.toISOString(),
          notes,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memblokir jadwal internal')
      }

      // Reset form
      setEventName('')
      setInstansi('')
      setPicName('')
      setPicPhone('')
      setStartAt('')
      setEndAt('')
      setNotes('')
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setErrorMsg((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Blokir Jadwal Acara GAMAS</h2>
              <p className="text-xs text-slate-500">
                Kunci ketersediaan unit untuk keperluan internal organisasi (Tarif Rp 0).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Unit selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Unit Inventaris <span className="text-rose-500">*</span>
            </label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Event name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Acara / Agenda GAMAS <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Contoh: Makrab GAMAS 2026, Rapat Kerja, Pelantikan"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Instansi / Organisasi / Acara */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Instansi / Organisasi / Acara <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              placeholder="Contoh: GAMAS UNNES Banyumas, BEM Fakultas, Panitia Wisuda"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* PIC name & phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Penanggung Jawab (PIC) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                placeholder="Contoh: Fajar (Sie Perlengkapan)"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> WhatsApp PIC
              </label>
              <input
                type="text"
                value={picPhone}
                onChange={(e) => setPicPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal Mulai <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal Selesai <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Catatan Lokasi / Keperluan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Dipakai di Gedung PKMU lt.2, jangan dipindah sebelum gladi resik selesai."
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Banner notice */}
          <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl text-purple-900 text-[11px] leading-relaxed">
            💡 <strong>Otomatis Anti-Bentrok:</strong> Unit ini otomatis terkunci dan tidak dapat disewa oleh pelanggan publik pada rentang tanggal tersebut. Tarif sewa otomatis diset <strong>Rp 0</strong> sehingga tidak mengganggu laporan omset keuangan.
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? 'Menyimpan...' : 'Kunci & Blokir Tanggal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
