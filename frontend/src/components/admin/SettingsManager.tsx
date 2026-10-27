'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Settings,
  Phone,
  Building,
  MapPin,
  Clock,
  Shield,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

interface BusinessSettingData {
  id: string
  businessName: string
  whatsappNumber: string
  address?: string | null
  rentalTerms?: string | null
  privacyPolicy?: string | null
  holdDurationMinutes: number
  timezone: string
}

interface SettingsManagerProps {
  initialSettings: BusinessSettingData
}

export default function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const router = useRouter()
  const [settings, setSettings] = useState<BusinessSettingData>(initialSettings)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: settings.businessName,
          whatsappNumber: settings.whatsappNumber,
          address: settings.address || '',
          rentalTerms: settings.rentalTerms || '',
          privacyPolicy: settings.privacyPolicy || '',
          holdDurationMinutes: Number(settings.holdDurationMinutes),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan pengaturan')
      }

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 4000)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Pengaturan Bisnis & WhatsApp</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Konfigurasi nomor WhatsApp penerima order, profil toko rental, dan durasi hold booking
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan bisnis dan nomor WhatsApp berhasil diperbarui!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* WhatsApp & Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-orange-500" /> Nama Usaha Rental *
            </label>
            <input
              type="text"
              required
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> Nomor WhatsApp Admin (Format 62...) *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 628823004545"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Semua tombol &quot;Kirim Pesanan ke WhatsApp&quot; akan langsung terhubung ke nomor ini.
            </p>
          </div>
        </div>

        {/* Address & Hold Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Alamat Toko / Pengambilan Unit
            </label>
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Jl. Raya No. 123, Sleman, Yogyakarta"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> Durasi Hold Booking Sementara (Menit)
            </label>
            <input
              type="number"
              min="5"
              max="1440"
              value={settings.holdDurationMinutes}
              onChange={(e) => setSettings({ ...settings, holdDurationMinutes: parseInt(e.target.value) || 30 })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Waktu batas penahanan unit saat pelanggan baru submit form sebelum dikonfirmasi admin.
            </p>
          </div>
        </div>

        {/* Rental Terms */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" /> Syarat & Ketentuan Sewa Umum
          </label>
          <textarea
            rows={4}
            value={settings.rentalTerms || ''}
            onChange={(e) => setSettings({ ...settings, rentalTerms: e.target.value })}
            placeholder="Aturan umum penyewaan, jaminan identitas (KTP/KTM/SIM), dan pengembalian unit..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Privacy Policy */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" /> Kebijakan Privasi
          </label>
          <textarea
            rows={3}
            value={settings.privacyPolicy || ''}
            onChange={(e) => setSettings({ ...settings, privacyPolicy: e.target.value })}
            placeholder="Keterangan perlindungan data pelanggan yang dimasukkan saat registrasi sewa..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
