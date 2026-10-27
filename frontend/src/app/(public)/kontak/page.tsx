import { prisma } from '@/lib/prisma'
import { buildWhatsAppUrl } from '@/lib/utils'
import { Phone, MessageCircle, MapPin, Clock, Mail, Shield, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Kontak & Lokasi',
  description: 'Hubungi admin Gamas Rent via WhatsApp atau kunjungi lokasi toko kami.',
}

export default async function KontakPage() {
  const setting = await prisma.businessSetting.findFirst()
  const waNumber = setting?.whatsappNumber || '6288223004545'
  const address = setting?.address || 'Gang Pete Selatan 1, Sekaran, Kontrakan Pak Sulistiyono No 16, Sebelah Laundry Badil Gang Kecil Masuk Rumah Warna Hijau No 16'

  return (
    <div className="pt-[72px] min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-16 sm:py-20">
        <div className="container-main text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-4">
            Layanan Pelanggan
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Hubungi <span className="text-orange-400">Gamas Rent</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Konsultasikan kebutuhan sewa acara Anda langsung dengan tim operasional kami.
          </p>
        </div>
      </section>

      {/* Contact Cards Grid */}
      <section className="py-16">
        <div className="container-main max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">WhatsApp Admin</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Respon tercepat untuk pengecekan ketersediaan unit, konfirmasi reservasi, dan pertanyaan sewa.
                </p>
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 font-mono text-xs font-bold text-emerald-800 mb-6">
                  +{waNumber}
                </div>
              </div>
              <a
                href={buildWhatsAppUrl(waNumber, 'Halo Admin Gamas Rent, saya ingin berkonsultasi seputar penyewaan...')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" /> Buka WhatsApp
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-5">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Lokasi Pengambilan</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Titik temu pengambilan dan pengembalian unit sewa (Self-Pickup).
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mb-6 leading-relaxed">
                  {address}
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/cprLBLfb1scPafYW7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all"
              >
                <MapPin className="w-4 h-4" /> Buka di Google Maps
              </a>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Jam Operasional</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Waktu pelayanan serah terima unit di toko dan respon chat admin.
                </p>
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mb-6">
                  <div className="flex justify-between">
                    <span className="font-semibold">Senin - Jumat:</span>
                    <span>08:00 - 20:00 WIB</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/60 pt-1.5">
                    <span className="font-semibold">Sabtu - Minggu:</span>
                    <span>08:00 - 18:00 WIB</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-800 text-center font-medium">
                Pemesanan via website tetap aktif 24 jam setiap hari!
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
